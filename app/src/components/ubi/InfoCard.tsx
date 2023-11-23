import Link from "next/link"

type CardProps = {
  supply: number,
  issuance: number,
}


export const InfoCard = ({ supply, issuance }: CardProps) => {
  return (
    <div className="card max-w-full w-fit rounded-xl border-2 border-purple-500 w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title w-fit mx-auto">Token info</h2>

        <div className="overflow-x-auto">

          <table className="table">
            <tbody>
              <tr>
                <th>Ticker & Price</th>
                <td className="flex flex-row gap-2 items-center">
                  <div>$ARGON</div>
                  <Link href="https://birdeye.so/token/4HgYp2eiokKcqe5AVAxpwCsfUE5pwCNTiPXvpSxYnDi6" target="_blank">
                    <button className="btn btn-sm btn-square">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 48 48">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.25 42.7q-1.6 0-2.775-1.175Q5.3 40.35 5.3 38.75V9.25q0-1.65 1.175-2.825Q7.65 5.25 9.25 5.25h13.7v4H9.25v29.5h29.5v-13.7h4v13.7q0 1.6-1.175 2.775Q40.4 42.7 38.75 42.7Zm10.5-11.65L17 28.25l19-19H25.95v-4h16.8v16.8h-4v-10Z" />
                      </svg>
                    </button>
                  </Link>
                </td>
              </tr>
              <tr>
                <th>Supply</th>
                <td>{supply != 0 ? supply : "loading..."}</td>
              </tr>
              <tr>
                <th>Daily issuance</th>
                <td>{issuance != 0 ? "~" + issuance + " ARGON per wallet" : "loading..."}</td>
              </tr>
              <tr>
                <th>Token's Explorer Page</th>
                <td>
                  <Link href="https://explorer.solana.com/address/4HgYp2eiokKcqe5AVAxpwCsfUE5pwCNTiPXvpSxYnDi6" target="_blank">
                    <button className="btn btn-sm btn-square">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 48 48">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.25 42.7q-1.6 0-2.775-1.175Q5.3 40.35 5.3 38.75V9.25q0-1.65 1.175-2.825Q7.65 5.25 9.25 5.25h13.7v4H9.25v29.5h29.5v-13.7h4v13.7q0 1.6-1.175 2.775Q40.4 42.7 38.75 42.7Zm10.5-11.65L17 28.25l19-19H25.95v-4h16.8v16.8h-4v-10Z" />
                      </svg>
                    </button>
                  </Link>
                </td>
              </tr>
              <tr>
                <th>Get Civic Uniqueness pass</th>
                <td>
                  <Link href="https://getpass.civic.com/" target="_blank">
                    <button className="btn btn-sm btn-square">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 48 48">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.25 42.7q-1.6 0-2.775-1.175Q5.3 40.35 5.3 38.75V9.25q0-1.65 1.175-2.825Q7.65 5.25 9.25 5.25h13.7v4H9.25v29.5h29.5v-13.7h4v13.7q0 1.6-1.175 2.775Q40.4 42.7 38.75 42.7Zm10.5-11.65L17 28.25l19-19H25.95v-4h16.8v16.8h-4v-10Z" />
                      </svg>
                    </button>
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}