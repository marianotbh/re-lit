import * as bindings from "./bindings";
import * as components from "./components";
import * as detection from "./dependency-detection";
import * as dom from "./dom-tracking";
import * as operators from "./operators";
import * as utils from "./utils";
import * as routing from "./routing";

export default {
	bindings,
	components,
	detection,
	dom,
	routing,
	...operators,
	utils
};

export * from "./bindings";
export * from "./components";
export * from "./dependency-detection";
export * from "./dom-tracking";
export * from "./operators";
export * from "./subscribables";
export * from "./routing";
export * from "./utils";
