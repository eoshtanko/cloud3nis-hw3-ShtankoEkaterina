import AsyncStorage from "@react-native-community/async-storage"
import { useNavigation } from "@react-navigation/native"
import { Button, Text } from "@ui-kitten/components"
import React, { useState, useEffect } from 'react';
import { hse_image } from "../assets/hse_image";
import * as ImagePicker from 'expo-image-picker';
import { Dimensions, KeyboardAvoidingView, StyleSheet, TextInput, View, TouchableOpacity, Image } from "react-native"

const initNote = "Должен признаться вам, не тая: \n я очень со зверем дружен.\n Но что касается кошек, \n то я\n всегда к ним был равнодушен.\n Так я и жил бы на свете,\n но вот,\n откуда — не знаем сами,\n у нас появился рыжайший кот,\n маленький, но — с усами.\n Этакий крохотный дуралей\n с повадками пса-задиры,\n некоронованный Царь Зверей\n в масштабах нашей квартиры.\n И я подружился с этим котом\n за то, что сколько угодно\n он слушал молча меня,\n и притом — \n слушал весьма охотно.";
const initTitle = "Первая заметка:"
export default function CreateNote() {
	const [note, setNote] = useState(initNote)
	const [title, setTitle] = useState(initTitle)
	const navigation = useNavigation()
	const [image, setImage] = useState(hse_image);

	useEffect(() => {
		(async () => {
			if (Platform.OS !== 'web') {
				const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
				if (status !== 'granted') {
					alert('Sorry, we need camera roll permissions to make this work!');
				}
			}
		})();
	}, []);

	const saveNote = async () => {
		if (title.trim() !== "") {
			const value = await AsyncStorage.getItem("NOTES")
			let n = value ? JSON.parse(value) : []
			let new_note = {
				id: n.length,
				title: title.trim(),
				content: note.trim(),
				image: image,
			};
			n.push(new_note)
			await AsyncStorage.setItem("NOTES", JSON.stringify(n)).then(() => navigation.navigate("AllNotes"))
			setNote("")
			setImage(hse_image)
			setTitle("Название")
		}
	}

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		console.log(result);

		if (!result.cancelled) {
			setImage(result.uri);
		}
	};

	return (
		<View style={styles.container}>
			<TextInput
				category="h1"
				value={title}
				maxLength={17}
				style={{ color: "black", fontSize: 34, fontWeight: "bold" }}
				onChangeText={setTitle}
			/>
			<TouchableOpacity onPress={pickImage} underlayColor="gray">
				<Image style={{ height: 200, width: 200, left: Dimensions.get("window").width / 5, marginTop: 20, marginBottom: 20 }}
					source={{ uri: image }} />
			</TouchableOpacity>
			<TextInput
				value={note}
				maxHeight={Dimensions.get('window').height / 2.4}
				onChangeText={setNote}
				style={{ color: "black", fontSize: 22 }}
				multiline={true}
				autoFocus={true}
				selectionColor="blue"
			/>
			<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.bottom}>
				<Button style={StyleSheet.button} appearance="filled" onPress={saveNote}>
					Create Note
				</Button>
			</KeyboardAvoidingView>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "skyblue",
		color: "black",
		textDecorationColor: "black",
		padding: 30,
		paddingTop: 80,

		width: Dimensions.get("window").width
	},
	bottom: {
		flex: 1,
		justifyContent: "flex-end",
		marginBottom: 36
	},
	button: {
		marginBottom: 30
	}
})
