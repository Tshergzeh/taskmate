import React from "react";  
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors, Radius, Spacing } from '../theme';
import { useSnackbar } from '../context/SnackbarContext';

type DateRangeFilterProps = {
    startDate: string;
    setStartDate: (text: string) => void;
    endDate: string;
    setEndDate: (text: string) => void;
};

export default function DateRangeFilter({ startDate, setStartDate, endDate, setEndDate }: DateRangeFilterProps) {
    const [showStartPicker, setShowStartPicker] = React.useState(false);
    const [showEndPicker, setShowEndPicker] = React.useState(false);
    const { showMessage } = useSnackbar();

    const handleStartChange = (_: any, selectedDate?: Date) => {
        setShowStartPicker(false);
        if (selectedDate) {
            setStartDate(selectedDate.toISOString().split('T')[0]); // Format to YYYY-MM-DD
        }
    };

    const handleEndChange = (_: any, selectedDate?: Date) => {
        setShowEndPicker(false);
        if (selectedDate) {
            const newEndDate = selectedDate.toISOString().split('T')[0];
            if (startDate && new Date(newEndDate) < new Date(startDate)) {
                showMessage('End date cannot be before start date', 'error');
                return;
            }
            setEndDate(newEndDate);
        }
    };

    const clearFilters = () => {
        setStartDate('');
        setEndDate('');
    }

    return (
        <View style={styles.container}>
            <View style={styles.datePickers}>
                <TouchableOpacity
                    style={styles.dateInput}
                    onPress={() => setShowStartPicker(true)}
                >
                    <Text style={styles.dateText}>
                        {startDate || 'Start date'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.dateInput}
                    onPress={() => setShowEndPicker(true)}
                >
                    <Text style={styles.dateText}>
                        {endDate || 'End date'}
                    </Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity 
                style={styles.clearTextButton} 
                onPress={clearFilters}
            >
                <Text style={styles.clearText}>Clear Filters</Text>
            </TouchableOpacity>

            {showStartPicker && (
                <DateTimePicker
                    value={startDate ? new Date(startDate) : new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={handleStartChange}
                />
            )}
            {showEndPicker && (
                <DateTimePicker
                    value={endDate ? new Date(endDate) : new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={handleEndChange}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing[4],
    },
    datePickers: {
        flexDirection: 'row',
        marginBottom: Spacing[2],
    },
    dateInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Radius.md,
        marginRight: Spacing[2],
        padding: Spacing[2],
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.gray[100],
    },
    dateText: {
        color: Colors.placeholder,
    },
    clearTextButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: Spacing[4],
        borderRadius: Radius.md,
        alignItems: 'center',
        padding: Spacing[2],
    },
    clearText: {
        color: Colors.buttonText,
        fontWeight: '600',
    },
});
