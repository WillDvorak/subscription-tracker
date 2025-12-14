import { createContext } from "react";

export const SubscriptionDataContext = createContext({
    subscriptionData: [{
        id: 1,
        priority: "High",
        title: "Netflix",
        price: 15.99,
        renewCycleTime: "Monthly",
        renewDate: "Dec. 19",
        color: "red",
        textColor: "white",
        imgUrl: "https://images.ctfassets.net/y2ske730sjqp/5QQ9SVIdc1tmkqrtFnG9U1/de758bba0f65dcc1c6bc1f31f161003d/BrandAssets_Logos_02-NSymbol.jpg?w=940"
    },
    {
        id: 2,
        priority: "Medium",
        title: "Spotify",
        price: 9.99,
        renewCycleTime: "Monthly",
        renewDate: "Dec. 25",
        color: "green",
        textColor: "white",
        imgUrl: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
    },
    {
        id: 3,
        priority: "Low",
        title: "Disney+",
        price: 7.99,
        renewCycleTime: "Monthly",
        renewDate: "Jan. 5",
        color: "blue",
        textColor: "white",

        imgUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg"
    }]
})