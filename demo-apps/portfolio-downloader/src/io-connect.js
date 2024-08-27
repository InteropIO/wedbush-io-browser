export const setupIntentListener = (setClientName) => (io) => {
    const intentHandler = (context) => {
        if (context.type !== "ClientPortfolio") {
            return;
        }

        const { clientName, portfolio } = context.data;

        setClientName(clientName);
        startPortfolioDownload(clientName, portfolio);
    };

    // Intents
    // Register an Intent (use the passed data)
    io.intents.register("ExportPortfolio", intentHandler);
};

const startPortfolioDownload = (clientName, portfolio) => {
    const dataToWrite = JSON.stringify(
        {
            date: new Date(Date.now()).toLocaleString("en-US"),
            portfolio,
        },
        null,
        4
    );

    const element = document.createElement("a");
    const blob = new Blob([dataToWrite], { type: "application/json" });
    const href = URL.createObjectURL(blob);

    element.href = href;
    element.download = `${clientName ? clientName + "'s " : ""}Portfolio.json`;

    element.click();
    URL.revokeObjectURL(href);
};
