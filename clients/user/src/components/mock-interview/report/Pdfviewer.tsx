import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const Pdfviewer = () => {

    const styles = StyleSheet.create({
        page: {
            flexDirection: 'row',
            backgroundColor: 'red',
            border: "1px solid red",
            width: "100%"
        },
        section: {
            margin: 10,
            padding: 10,
            flexGrow: 1,
        },
    });

    return (
        <div className="w-full bg-yellow-500" >
            <Document style={{width:"100%"}} >
                <Page size="A4" style={styles.page}>
                    <View style={styles.section}>
                        <Text>Section #1</Text>
                    </View>
                    <View style={styles.section}>
                        <Text>Section #2</Text>
                    </View>
                </Page>
            </Document>
        </div>
    )
}

export default Pdfviewer
