

type Country = {
    name: string;
    diallingCode: string;
    ISO2: string;
    emoji: string;
    emojiU: string;
    native: string;
    timezones: {
      name: string;
      utcOffset: number;
      offsetStr: string;
      countries: string[];
    }[];
  }
  