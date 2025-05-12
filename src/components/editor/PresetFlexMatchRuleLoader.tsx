import { RuleSet } from "../../utils/definitions";

export async function loadPresetFlexMatchRule(jsonFileName: string): Promise<RuleSet> {
  try {
    const response = await fetch(`/jsonRules/${jsonFileName}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error loading JSON file:", error);
    throw error;
  }
}
