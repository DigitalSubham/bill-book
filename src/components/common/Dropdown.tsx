import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Text } from 'react-native-paper';

interface Props {
    label: string;
    value: string | number | null;
    items: { label: string; value: string | number }[];
    onChange: (value: any) => void;
    placeholder?: string;
    zIndex?: number;
    error?: string;
    searchable?: boolean;
}

const AppDropdownPicker: React.FC<Props> = ({
    label,
    value,
    items,
    onChange,
    placeholder = 'Select',
    zIndex = 2000,
    error,
    searchable = false,
}) => {
    const [open, setOpen] = useState(false);

    return (
        <View style={{ zIndex }}>
            <Text style={styles.label}>{label}</Text>

            <DropDownPicker
                listMode='MODAL'
                mode='BADGE'
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={(cb) => onChange(cb(value))}
                setItems={() => { }}
                placeholder={placeholder}
                style={[
                    styles.dropdown,
                    !!error && styles.errorBorder,
                ]}
                searchable={searchable}
                searchPlaceholder="Search..."
                dropDownContainerStyle={styles.dropdownContainer}
                closeAfterSelecting={true}
                modalContentContainerStyle={styles.modalContent}
                modalTitle={label}
                modalTitleStyle={styles.modalTitle}
                modalProps={{
                    transparent: true,
                    presentationStyle: 'overFullScreen',
                }}

                modalAnimationType="slide"
            />

            {!!error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

export default React.memo(AppDropdownPicker);

const styles = StyleSheet.create({
    label: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    dropdown: {
        borderColor: '#ccc',
        minHeight: 52,
    },
    dropdownContainer: {
        borderColor: '#ccc',
    },
    errorBorder: {
        borderColor: '#f44336',
    },
    errorText: {
        color: '#f44336',
        fontSize: 12,
        marginTop: 4,
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 16,
        marginHorizontal: 30,
        borderRadius: 12,
        elevation: 10,
        maxHeight: 400,
    },
    modalTitle: {
        fontWeight: "600",
        fontSize: 16,
        color: "#2c3e50",
        textAlign: "center",
        marginBottom: 8,
    },
});
