const defaultSym = {
    type: "simple-fill", // autocasts as new SimpleFillSymbol()
    outline: {
        // autocasts as new SimpleLineSymbol()
        color: [128, 128, 128, 1],
        width: "0.5px",
    },
};
export const generateRenderer =  (field = "final_value") => {
    return {
        type: 'simple', // autocasts as new SimpleRenderer()
        symbol: defaultSym,
        label: "UGB Percent Rank",
        visualVariables: [
            {
                type: "color",
                field,
                legendOptions: {
                    title: "UGB Percent Rank",
                },
                stops: [
                    {
                        value: 0,
                        color: "#fef0d9",
                        label: "0",
                    },
                    {
                        value: 0.25,
                        color: "#fdcc8a",
                        label: "0.25"
                    },
                    {
                        value: 0.50,
                        color: "#fc8d59",
                        label: "0.50"
                    },
                    {
                        value: 0.75,
                        color: "#e34a33",
                        label: "0.75"
                    },
                    {
                        value: 1,
                        color: "#b30000",
                        label: "1",
                    },
                ],
            },
        ],
    };
}