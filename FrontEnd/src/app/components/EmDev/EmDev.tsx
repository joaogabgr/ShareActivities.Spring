import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import Header from '../header/Header';

export function EmDev() {
    return (
        <SafeAreaView style={styles.container}>
            <Header/>
        <View style={styles.container}>
            <Text style={styles.text}>🚧 Em Desenvolvimento 🚧</Text>
            <Text style={styles.subText}>Esta funcionalidade estará disponível em breve!</Text>
        </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 10,
    },
    subText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
});