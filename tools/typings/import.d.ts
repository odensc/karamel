declare global {
	interface System {
		import(request: string): Promise<any>;
	}

	const System: System;
}

export {};
