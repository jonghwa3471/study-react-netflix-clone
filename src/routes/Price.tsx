import { InfoData } from "./Coin";

interface PriceProps {
  data: InfoData | undefined;
}

function Price({ data }: PriceProps) {
  return (
    <>
      <h1>
        {data ? `High: $ ${data.market_data.high_24h.usd}` : "Loading..."}
      </h1>
      <h1>{data ? `Low: $ ${data.market_data.low_24h.usd}` : "Loading..."}</h1>
    </>
  );
}

export default Price;
