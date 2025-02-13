import {
  View,
  Text,
  FlatList,
  Button,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Share,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import supabase from "../backend/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Octicons from '@expo/vector-icons/Octicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface Todo {
  id: string;
  text: string;
  done: boolean;
  user_id: string;
  isSyncing?: boolean;
}


//asci art

const generateAsciiTodo = (tasks: Todo[]) => {
  const date = new Date().toLocaleString();
  let ascii = `╔══════════════════════════════╗\n`;
  ascii += `║          TODO LIST           ║\n`;
  ascii += `╠══════════════════════════════╣\n`;

  tasks.forEach((task, index) => {
    const status = task.done ? 'x' : 'o';
    ascii += `║ ${status} ${task.text.slice(0, 25).padEnd(25)} ║\n`;
    if (index !== tasks.length - 1) {
      ascii += `╟──────────────────────────────╢\n`;
    }
  });

  ascii += `╠══════════════════════════════╣\n`;
  ascii += `║ Generated: ${date.padEnd(17)} ║\n`;
  ascii += `╚══════════════════════════════╝`;
  return ascii;
};

const HomeScreen = ({ navigation }: any) => {
  const [tasks, setTasks] = useState<Todo[]>([]);
  const [todo, setTodo] = useState("");
  const [edit, setEdit] = useState(false);

  // Load tasks from AsyncStorage on component mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const savedTasks = await AsyncStorage.getItem("tasks");
        if (savedTasks) setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error("Error loading tasks:", error);
      }
    };
    loadTasks();
  }, []);

  // Save tasks to AsyncStorage whenever they change
  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
      } catch (error) {
        console.error("Error saving tasks:", error);
      }
    };
    saveTasks();
  }, [tasks]);

  // Realtime subscription setup
  useEffect(() => {
    const channel = supabase
      .channel("todos")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "todos" },
        (payload) => {
          switch (payload.eventType) {
            case "INSERT":
              setTasks((prev) => {
                const newTodo = payload.new as Todo;
                return prev.some((t) => t.id === newTodo.id)
                  ? prev
                  : [...prev, newTodo];
              });
              break;
            case "UPDATE":
              setTasks((prev) =>
                prev.map((t) =>
                  t.id === payload.new.id ? (payload.new as Todo) : t
                )
              );
              break;
            case "DELETE":
              setTasks((prev) =>
                prev.filter((t) => t.id !== (payload.old as Todo).id)
              );
              break;
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Fetch initial tasks from Supabase
  const fetchTasks = useCallback(async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching tasks:", error);
      return;
    }

    setTasks(data || []);
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Add task with optimistic UI update
  const addTask = async (text: string) => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user || !text.trim()) return;

    const tempId = Date.now().toString();
    const newTask: Todo = {
      id: tempId,
      text: text.trim(),
      done: false,
      user_id: user.id,
      isSyncing: true,
    };

    setTasks((prev) => [...prev, newTask]);

    try {
      const { data, error } = await supabase
        .from("todos")
        .insert({ text: text.trim(), done: false, user_id: user.id })
        .select();

      if (error) throw error;

      setTasks((prev) =>
        prev.map((t) =>
          t.id === tempId ? { ...data[0], isSyncing: false } : t
        )
      );
    } catch (error) {
      console.error("Error adding task:", error);
      setTasks((prev) => prev.filter((t) => t.id !== tempId));
    }
    setTodo("");
  };

  // Toggle done status with optimistic update
  const toggleDone = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const updatedTask = { ...task, done: !task.done };
    setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));

    try {
      const { error } = await supabase
        .from("todos")
        .update({ done: updatedTask.done })
        .eq("id", taskId);

      if (error) throw error;
    } catch (error) {
      console.error("Error updating task:", error);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? task : t)));
    }
  };

  // Delete task with optimistic update
  const deleteTask = async (taskId: string) => {
    const taskToDelete = tasks.find((t) => t.id === taskId);
    if (!taskToDelete) return;

    setTasks((prev) => prev.filter((t) => t.id !== taskId));

    try {
      const { error } = await supabase.from("todos").delete().eq("id", taskId);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting task:", error);
      setTasks((prev) => [...prev, taskToDelete]);
    }
  };



  //Emojis
  const NOT_DONE_ICON = String.fromCodePoint(0x1f7e0);
  const DONE_ICON = String.fromCodePoint(0x2705);

  //share button
  const handleShare = async () => {
    try {
      const asciiContent = generateAsciiTodo(tasks);
      
      await Share.share({
        message: `Check out my todo list:\n\n${asciiContent}\n\nShared via Todoss`,
        title: 'My Todo List'
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const accNav = () => {
    navigation.navigate("Account");
  }



  //Code for screen
  return (
    <View style={styles.pageContainer}>
      <View style={{alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
        <MaterialCommunityIcons name="account-outline" size={24} color="gray" style={{paddingTop: 10}} onPress={() => accNav()}/>
        <Text style={styles.headingText}>Todos 🎃</Text>
        <EvilIcons name="share-apple" size={24} color="gray"style={{paddingTop: 10}} onPress={() => handleShare()}/>
      </View>
      <TextInput
        placeholder="What do you want to do today?"
        value={todo}
        onChangeText={setTodo}
        onSubmitEditing={() => addTask(todo)}
        style={styles.inputbox}
      />

      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <View style={[styles.taskView, {backgroundColor: item.done ? "#dfd" : "#ffd"}]}>
            <TouchableOpacity
              onPress={() => toggleDone(item.id)}
              style={styles.taskContainer}
            >
              <Text style={{fontSize: 16}}>{item.done ? DONE_ICON : NOT_DONE_ICON}</Text>
              <Text
                style={[styles.taskText, {textDecorationLine: item.done ? "line-through" : "none", }]}
              >
                {item.text}
              </Text>
            </TouchableOpacity>

            {edit ? <MaterialIcons name="delete-outline" size={24} color="red" onPress={() => deleteTask(item.id)}/> : ''}
          </View>
        )}
        keyExtractor={(item) => item.id}
        style={styles.listContainer}
      />
      <View style={styles.editContainer}>
        <Octicons name="pencil" size={20} color="gray" onPress={() => setEdit(!edit)}/>
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    paddingTop: 40,
    padding: 12,
    flex: 1,
  },
  inputbox: {
    width: "100%",
    marginTop: 10,
    borderRadius: 12,
    borderWidth: 3,
    padding: 10,
    fontSize: 20,
  },
  headingText: {
    fontSize: 24,
    marginTop: 10,
    fontWeight: "bold",
  },
  listContainer: {
    width: "100%",
    marginTop: 20,
    flex: 1,
  },
  taskContainer: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    gap: 10,
  },
  taskText: {
    fontSize: 20,
  },
  taskView: {
    borderRadius: 8,
    marginBottom: 16,
    padding: 15,
    flexDirection: "row",
    backgroundColor: "#ffd",
  },
  editContainer: {
    alignSelf: "flex-end",
    alignItems: 'center',
    padding: 20,
    width: 'auto',
    borderRadius: 30
  },
});

export default HomeScreen;
