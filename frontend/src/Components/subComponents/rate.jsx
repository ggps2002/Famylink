import { Rate } from "antd";

export default function Ra({ points, size }) {
    // Determine the color based on the points value
    const getColor = () => {
        if (points >= 1 && points < 3) return "#FF5269"; // Between 1 and 2
        if (points === 3) return "#FEA500"; // Exactly 3
        if (points > 3) return "#029E76"; // Greater than 3
        return "#D9D9D9"; // Default color (optional)
    };

    return (
        <Rate
            disabled
            value={points}
            style={{
                color: getColor(),
                fontSize: size,
                margin: 0,
                padding: 0,
            }}
        />
    );
}
