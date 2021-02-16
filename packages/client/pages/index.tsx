import { IQuestion } from "@nhie/api";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { MdError, MdQuestionAnswer, MdVideogameAsset } from "react-icons/md";
import { FaGithub, FaHeart, FaNetworkWired } from "react-icons/fa"
import useCreateGameMutation from "../hooks/use-create-game-mutation";
import getConfiguration from 'next/config';
import Head from "next/head";
import CreateGameModal from "../components/create-game-modal";

interface HomePageProps {
  question: IQuestion;
}

const HomePage: NextPage<HomePageProps> = (props) => {
  const router = useRouter();
  const [joinGameValue, setJoinGameValue] = useState("");
  const [showCreateGameModal, setShowCreateGameModal] = useState(false);

  const joinGame = useCallback(() => {
    router.push(`/${joinGameValue}`);
  }, [joinGameValue, router])


  return <div>
    <Head>
      <title>Ich habe noch nie... online!</title>
    </Head>
    {showCreateGameModal && <CreateGameModal close={() => setShowCreateGameModal(false)} />}
    <div className="bg-gray-900" id="navigation">
      <div className="mx-auto max-w-screen-lg px-5">
        <div className="flex">
          <div id="logo" className="py-4">
            <h1 className="text-center font-bold md:text-lg text-white shadows-into-light transform -skew-y-6">Never Have<br />I Ever<small>.de</small></h1>
          </div>
          <div className="flex flex-grow justify-end text-white font-bold">
            <a href="#play-local" className="flex items-center px-5">Lokal spielen</a>
            <a href="#join-online-game" className="flex items-center px-5">Spiel beitreten</a>
            <a href="#create-online-game" className="flex items-center px-5">
              <span className="bg-purple-500 p-4 py-2 rounded-full">
                Spiel erstellen
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
    <>
      {router.query['game-error'] === 'not-existing' &&
        <div className="bg-red-500 p-5 text-white flex">
          <div className="flex items-center">
            <MdError className="mr-3 inline-block text-2xl"/>
          </div>
          <div>
            <strong>Das Spiel konnte nicht gefunden werden!</strong><span className="text-opacity-80 ml-1">Bitte überprüfe die Schreibweise der URL oder erstelle eine neues Spiel.</span>
          </div>
        </div>
      }
      {router.query['game-error'] === 'full' &&
        <div className="bg-red-500 p-5 text-white flex">
          <div className="flex items-center">
            <MdError className="mr-3 inline-block text-2xl"/>
          </div>
          <div>
            <strong>Dieses Spiel is voll!</strong><span className="text-opacity-80 ml-1">Leider ist die maximale Spielerzahl bereits erreicht.</span>
          </div>
        </div>
      }
      {router.query['game-error'] === 'kicked' &&
        <div className="bg-red-500 p-5 text-white flex">
          <div className="flex items-center">
            <MdError className="mr-3 inline-block text-2xl"/>
          </div>
          <div>
            <strong>Du wurdest aus dem Spiel gekickt!</strong><span className="text-opacity-80 ml-1">Bitte benimm dich nächstes mal.</span>
          </div>
        </div>
      }
    </>
    <div className="bg-gradient-to-r from-purple-500 to-purple-900 py-36">
      <div className="mx-auto px-5 max-w-screen-lg">
        <h1 className="text-white text-3xl md:text-8xl">{props.question.text}</h1>
        <p className="mt-5 text-lg md:text-xl">Finde heraus was für Laster deine Freunde, Kollegen oder Bekannten haben. Online, Offline oder allein.</p>
      </div>
    </div>
    <div className="py-20 bg-gray-800">
      <div className="mx-auto px-5 max-w-screen-lg">
        <div className="grid grid-cols-1 sm:grid-cols-3 text-gray-400 text-2xl gap-20 text-center">
          <div className="text-center flex flex-col items-center justify-center"><MdQuestionAnswer className="text-green-500 text-4xl mb-5" />Mehr als 100 extrem würzige Fragen</div>
          <div className="text-center flex flex-col items-center justify-center"><FaHeart className="text-red-400 text-4xl mb-5" /> Gebaut mit Herz und Twitch</div>
          <div className="text-center flex flex-col items-center justify-center"><FaNetworkWired className="text-blue-500 text-4xl mb-5" /> Lokal und Online Spielbar</div>
        </div>
      </div>
    </div>
    <div className="bg-gray-100 py-20" id="join-online-game">
      <div className="mx-auto px-5 max-w-screen-lg grid grid-cols-1 md:grid-cols-2 gap-20">
        <div>
          <h2 className="text-gray-800 text-5xl">Spiel beitreten</h2>
          <p className="mt-5 text-lg text-gray-500">Deine Freunde haben schon ein Spiel erstellt? Dann geht's hier weiter. Gib Kit, sonst verpasst du die Party.</p>
          <p className="mt-5">Um dem Spiel beizutreten brauchst du einen Beitrittscode von jemandem aus deiner Sitzung. Den findest du aktuell relative praktisch in der URL. Wenn deine Freunde gerade dabei sind, können sie dir auch einfach den Link schicken. Geht schneller und ihr seid eh alle vernetzt.</p>
        </div>
        <div className="flex justify-center items-center">
          <div className="flex">
            <input className="flex-grow p-2 border-2 border-r-0 rounded-l-lg" value={joinGameValue} onChange={event => setJoinGameValue(event.currentTarget.value)} />
            <button className="bg-purple-500 p-2 px-4 font-bold text-white rounded-r-lg disabled:opacity-50" onClick={joinGame}>
               Spiel beitreten
             </button>
          </div>
        </div>
      </div>
    </div>
    <div className="bg-gray-50 py-20" id="create-online-game">
      <div className="mx-auto px-5 max-w-screen-lg grid grid-cols-1 md:grid-cols-2 gap-20">
        <div className="flex items-center justify-center">
          <button className="p-5 text-xl bg-purple-500 text-white rounded-lg font-bold flex items-center shadow-lg transform transition hover:scale-110" onClick={() => setShowCreateGameModal(true)} ><MdVideogameAsset className="mr-2 text-3xl" /> Sitzung erstellen</button>
        </div>
        <div>
          <h2 className="text-gray-800 text-5xl">Sitzung erstellen</h2>
          <p className="mt-5 text-lg text-gray-500">Starte ein Spiel, lade deine Freunde ein und habe einen unvergesslichen Abend</p>
          <p className="mt-5">Wenn du eine Sitzung erstellst kannst du den Link teilen um mit deinen Freunden/Kollegen/Feinden zu spielen. Eventuelle Verluste sind kein Problem.</p>
        </div>
      </div>
    </div>
    <div className="bg-gray-100 py-20" id="play-local">
      <div className="mx-auto px-5 max-w-screen-lg grid grid-cols-1 md:grid-cols-2 gap-20">
        <div>
          <span className="border border-green-500 text-green-500 p-1 px-2 rounded-lg uppercase border-2 text-xs font-bold inline-block mb-4">Kommt bald</span>
          <h2 className="text-gray-800 text-5xl">Offline spielen</h2>
          <p className="mt-5 text-lg text-gray-500">Egal ob alleine, mit der Katze, oder einem Treffen in Reallife. Manchmal darf's auch offline sein.</p>
          <p className="mt-5">Hier kannst du offline durch die Fragen swipen. Eventuell kannst du sie auf einer eher lahmen Party deinen Freunden vorlesen und die Fragen durch kecke Kommentare wie "Ohje, der wird böse" oder "Na da bin ich mal gespannt" aufpeppen.</p>
        </div>
        <div className="flex justify-center items-center">
          <button className="p-5 text-xl bg-purple-500 text-white rounded-lg font-bold flex items-center shadow-lg disabled:opacity-50" disabled>Offline spielen</button>
        </div>
      </div>
    </div>
    <div className="bg-center relative" style={{ background: `url(/images/bois-cracking-some-cold-ones.jpg)`}}>
      <div className="w-full h-full absolute top-0 left-0 z-0 p-5">
        <div className="bg-gradient-to-r from-gray-800 to-purple-900 h-full w-full opacity-70" />
      </div>
      <div className="py-20 relative z-1">
        <div className="mx-auto px-10 p-5 max-w-screen-lg text-white">
          <div>
            <p className="text-4xl">"Absoluter Knaller - Macht remote feiern gleich viel geiler!"</p>
            <span className="text-gray-300 mt-4">- phuesch 2021</span>
          </div>
          <div className="mt-10 flex flex-col items-end">
            <p className="text-4xl text-right">"ich soll was gutes zum Game sagen... joa"</p>
            <span className="text-gray-300 mt-4">- TheMutlu311, 2021</span>
          </div>
          <div className="mt-10">
            <p className="text-4xl">"In der Zukunft wird neverhaveiever.de steiler gehen als Gamestop. save.."</p>
            <span className="text-gray-300 mt-4">- mcpebooster_ 2021</span>
          </div>
        </div>
      </div>
      <span className="absolute bottom-0.5 right-0.5 text-xs opacity-50">Photo by <a href="https://unsplash.com/@katweil?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Kats Weil</a> on <a href="https://unsplash.com/s/photos/alcohol-party?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>
    </div>
    <div className="bg-gray-100">
      <div className="mx-auto px-5 max-w-screen-lg py-20">
        <h2 className="text-gray-800 text-5xl">Noch Ideen?</h2>
        <p className="mt-5 text-lg text-gray-500">Hilf mit und verbessere die Welt... oder zumindest neverhaveiever.de</p>
        <p className="mt-3">Du hast bei dem peinlichen Trinkabend mit Kollegen nicht erfahren was du wolltest? Irgendwas ging mitten in der Session kaputt? Du weißt wie man das Spiel 100% besser macht? Dann schreib nen Issue auf Github!</p>
        <div>
          <a href="https://github.com/yanniz0r/never-have-i-ever" className="mt-4 bg-black inline-block rounded-lg text-white p-2 px-4 inline-flex"><FaGithub className="mr-2 text-xl" /> Github auschecken</a>
        </div>
      </div>
    </div>
    <div className="bg-gray-800">
      <div className="mx-auto px-5 max-w-screen-lg p-5 text-gray-400">
        <div className="grid grid-cols-3">
          <div className="flex items-center">
            &copy; {new Date().getFullYear()}
          </div>
          <div>
            <p className="text-center">Gebaut mit Blut, Schweiß und Tränen von <a href="https://twitch.tv/yanniz0r" className="text-purple-400 hover:underline">@yanniz0r</a></p>
          </div>
          <div className="flex justify-end items-center">
            <a href="" className="hover:text-purple-400">Impressum</a>
          </div>
        </div>
      </div>
    </div>
  </div>
}

export const getServerSideProps: GetServerSideProps<HomePageProps> = async () => {
  const payload = await fetch(`${getConfiguration().publicRuntimeConfig.backendUrl}/question/random`);
  const question = await payload.json() as IQuestion;
  return {
    props: {
      question
    }
  }
}

export default HomePage;
