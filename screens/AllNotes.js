import AsyncStorage from "@react-native-community/async-storage"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { Divider, List, ListItem, Text } from "@ui-kitten/components"
import React, { useState } from "react"
import { StyleSheet, View } from "react-native"

export default function AllNotes() {
	const [notes, setNotes] = useState([])
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

	const renderItem = ({ item, index }) => (
		<ListItem
			title={<Text category="h2">{item.title}</Text>}
			onPress={() =>
				navigation.navigate("Note", {
					singleNote: item,
				})}
		/>
	)

	return (
		<View style={{ backgroundColor: "skyblue", flex: 1 }}>
			<Text style={styles.title} category="h1">
				Notes
			</Text>
			<List
				style={styles.container}
				data={notes.reverse()}
				ItemSeparatorComponent={Divider}
				endFillColor='skyblue'
				renderItem={renderItem}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		fontSize: 30
	},
	item: {
		marginVertical: 4,
		fontSize: 30
	},
	title: {
		textAlign: "center",
		marginTop: 50
	},
	notes: {
		fontSize: 30
	}
})
