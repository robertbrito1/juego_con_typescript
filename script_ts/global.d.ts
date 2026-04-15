declare const bootstrap: {
    Modal: {
        new (
            element: Element,
            options?: {
                backdrop?: boolean | "static";
                keyboard?: boolean;
            }
        ): {
            show(): void;
            hide(): void;
        };
        getOrCreateInstance(element: Element): {
            show(): void;
            hide(): void;
        };
    };
};