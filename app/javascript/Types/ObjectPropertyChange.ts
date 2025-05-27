export type ObjectPropertyChange =
	| {
			propertyName: "fill" | "stroke" | "text" | "align" | "verticalAlign";
			newValue: string;
	  }
	| {
			propertyName:
				| "strokeWidth"
				| "opacity"
				| "cornerRadius"
				| "fontSize"
				| "x"
				| "y"
				| "width"
				| "height"
				| "radiusX"
				| "radiusY";
			newValue: number;
	  }
	| {
			propertyName: "locked";
			newValue: boolean;
	  };
