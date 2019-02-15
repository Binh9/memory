defmodule MemoryWeb.PageController do
  use MemoryWeb, :controller

  def game(conn, %{"name" => name}) do
    IO.puts "Hello"
    render conn, "game.html", name: name
  end

  def index(conn, _params) do
    render conn, "index.html"
  end
end
