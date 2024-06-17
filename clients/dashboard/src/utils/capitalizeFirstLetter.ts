export default function capitalizeFirstLetter(inputString: string): string {
    if (inputString.length === 0 || +inputString.charAt(0)) {
      return inputString;
    }
    return inputString
      .charAt(0)
      .toUpperCase() +
      inputString
        .slice(1)
        .split('')
        .map((char, index) => (char === char.toUpperCase() ? ` ${char}` : char))
        .join('');
  }
  