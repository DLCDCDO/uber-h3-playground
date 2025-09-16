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
        type: "simple", // autocasts as new SimpleRenderer()
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
                    color: "#FFFCD4",
                    label: "0",
                    },
                    {
                    value: 1,
                    color: "#350242",
                    label: "1",
                    },
                ],
            },
        ],
    };
}