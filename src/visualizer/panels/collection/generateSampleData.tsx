export interface UserDataUser {
    id: string;
    attribute: number | string | string[] | Record<string, number>;
    keyAttribute: number | string ;
}

enum sortattributeTypeDefinition {
    number = "number",
    string = "string",
    string_list = "string_list",
    string_number_map = "string_number_map"
}

export function generateName() {
    return Math.random().toString(36).substring(2, 11);
}

function generateNumber() {
    return Math.floor(Math.random() * 900) + 100;
}

export function generateSampleUsersData(length: number, sortKeyType: string, mapKey: string | undefined ): UserDataUser[] {
    const retval =  Array.from({ length }, (_, i) => {
        let sortAttribute: number | string | string[] | Record<string, number> = "";
        let keyAttribute: number | string = "";

        switch (sortKeyType) {
            case sortattributeTypeDefinition.number:
                sortAttribute = generateNumber(); // Random 3-digit number
                keyAttribute = sortAttribute;
                break;
            case sortattributeTypeDefinition.string:
                sortAttribute = generateName(); // foo_{alphabet}
                keyAttribute = sortAttribute;
                break;
            case sortattributeTypeDefinition.string_list:
                sortAttribute = [generateName(), generateName()]; // Array with 2 strings
                keyAttribute = sortAttribute[0];
                break;
            case sortattributeTypeDefinition.string_number_map:
                sortAttribute = {
                    [generateName()]: generateNumber(),
                    [generateName()]: generateNumber()
                }; // Object with 2 key-value pairsWill be filled later
                break;
        }

        return {
            id: `user${i + 1}`,
            attribute: sortAttribute,
            keyAttribute: keyAttribute
        };
    });

    // select value from map
    if (sortKeyType === "string_number_map" ) {
        retval.forEach((user) => {
            const entries = Object.entries(user.attribute);
            const selectedEntry = entries.reduce((selected, entry) => {
                if (mapKey === "minValue") {
                    return entry[1] < selected[1] ? entry : selected;
                } else {
                    return entry[1] > selected[1] ? entry : selected;
                }
            }, entries[0]);
            user.keyAttribute = selectedEntry[1];
        });
    }

    return retval;
}


// getDistance from variable including string and number
export const getDistance = (value: string | number, base: string | number) => {
    if (typeof value === "number" && typeof base === "number") {
        return Math.abs(value - base);
    } else if (typeof value === "string" && typeof base === "string") {
        return Math.abs(value.localeCompare(base));
    }
    return 0;
};



export function generateRandomStringListValue(length: number): string[] {
    return Array.from({ length }, () => generateName());
}