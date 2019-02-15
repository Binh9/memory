import css from "../css/app.css";

import "phoenix_html";
import $ from "jquery";

import socket from "./socket";
import game_init from "./starter-game";

$(() => {
  let root = document.getElementById('root');
  let channel = socket.channel("games:" + window.gameName, {});
  game_init(root, channel);
  //game_init(root);
});

