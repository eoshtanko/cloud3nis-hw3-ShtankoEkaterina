import AsyncStorage from "@react-native-community/async-storage"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { Button, Text } from "@ui-kitten/components"
import React, { useState } from "react"
import { Dimensions, KeyboardAvoidingView, StyleSheet, TextInput, View, TouchableOpacity, Image } from "react-native"

// Просмотри и...удаление заметки.
export default function Note({ route }) {
	const [notes, setNotes] = useState([])
	const { singleNote } = route.params
	const navigation = useNavigation()

	useFocusEffect(
		React.useCallback(() => {
			getNotes()
		}, [])
	)

	const getNotes = () => {
		AsyncStorage.getItem("NOTES").then((notes) => {
			setNotes(JSON.parse(notes))
		})
	}

	// Удаление заметки
	const deleteNote = async () => {
		let id = singleNote.id
		const newNotes = await notes.filter((note) => note.id !== singleNote.id)
		var i;
		for (i = id; i < notes.length; i++) {
			notes[i].id = notes[i].id - 1;
		}
		await AsyncStorage.setItem("NOTES", JSON.stringify(newNotes)).then(() => navigation.navigate("AllNotes"))
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title} category="h1">
				{singleNote.title}
			</Text>
			<Image style={{ height: 200, width: 200, left: Dimensions.get("window").width / 5, marginTop: 20, marginBottom: 20 }}
				source={{ uri: singleNote.image }} />
			<TextInput
				value={singleNote.content}
                                editable={false}
				maxHeight={Dimensions.get('window').height / 2.2}
				style={{ color: "black", fontSize: 22 }}
				multiline={true}
				selectionColor="blue"
			/>
			<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.bottom}>
				<Button style={StyleSheet.button} appearance="ghost" size="giant" onPress={deleteNote}>
					Delete
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
	},
	button: {
		marginBottom: 0
	}
})
