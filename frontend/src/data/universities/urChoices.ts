export const UR_MAX_CHOICES = 3 as const;

export type URPreference = 1 | 2 | 3;

export interface URProgrammeChoice {
  preference: URPreference;
  programmeId: string;
  programmeName: string;
  programmeCode?: string;
  eligibilityStatus?: "eligible" | "warning" | "ineligible" | "unknown";
}

export type URThreeChoices = [
  URProgrammeChoice | null,
  URProgrammeChoice | null,
  URProgrammeChoice | null
];

export const EMPTY_UR_CHOICES: URThreeChoices = [null, null, null];

export function hasDuplicateURChoices(
  choices: URThreeChoices,
): boolean {
  const ids = choices
    .filter(Boolean)
    .map((choice) => choice!.programmeId);

  return new Set(ids).size !== ids.length;
}

export function isURChoiceSelected(
  choices: URThreeChoices,
  programmeId: string,
): boolean {
  return choices.some(
    (choice) => choice?.programmeId === programmeId,
  );
}

export function getURChoice(
  choices: URThreeChoices,
  preference: URPreference,
): URProgrammeChoice | null {
  return choices[preference - 1];
}

export function setURChoice(
  choices: URThreeChoices,
  preference: URPreference,
  choice: URProgrammeChoice | null,
): URThreeChoices {
  const next: URThreeChoices = [...choices] as URThreeChoices;
  next[preference - 1] = choice;
  return next;
}

export function getSelectedURChoices(
  choices: URThreeChoices,
): URProgrammeChoice[] {
  return choices.filter(
    (choice): choice is URProgrammeChoice => Boolean(choice),
  );
}

export function areURChoicesComplete(
  choices: URThreeChoices,
): boolean {
  return choices.every(Boolean);
}
