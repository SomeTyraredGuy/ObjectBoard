export type ObjectPropertyChange =
	| {
			propertyName: "fill";
			newValue: string;
	  }
	| {
			propertyName: "stroke";
			newValue: string;
	  }
	| {
			propertyName: "strokeWidth";
			newValue: number;
	  }
	| {
			propertyName: "opacity";
			newValue: number;
	  }
	| {
			propertyName: "cornerRadius";
			newValue: number;
	  }
	| {
			propertyName: "text";
			newValue: string;
	  };
