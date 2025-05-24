export type ObjectPropertyChange =
	| {
			propertyName: "fill" | "stroke" | "text" | "align" | "verticalAlign";
			newValue: string;
	  }
	| {
			propertyName: "strokeWidth" | "opacity" | "cornerRadius" | "fontSize";
			newValue: number;
	  };
