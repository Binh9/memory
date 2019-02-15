defmodule MemoryWeb.GamesChannel do
  use MemoryWeb, :channel

  alias Memory.Game
  alias Memory.BackupAgent

  def join("games:" <> name, payload, socket) do
    if authorized?(payload) do
      game = BackupAgent.get(name) || Game.new()
      socket = socket
      |> assign(:game, game)
      |> assign(:name, name)
      BackupAgent.put(name, game)
      {:ok, %{"join" => name, "game" => Game.client_view(game)}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # For reset
  def handle_in("reset", payload, socket) do
    name = socket.assigns[:name]
    game = Game.reset(socket.assigns[:game])
    socket = assign(socket, :game, game)
    BackupAgent.put(name, game)
    {:reply, {:ok, %{ "game" => Game.client_view(game)}}, socket}
  end
  
  # When the tile is clicked, reveal it
  def handle_in("reveal", %{"id" => id}, socket) do
    IO.puts("reveal")
    name = socket.assigns[:name]
    game = Game.reveal(socket.assigns[:game], id)
    socket = assign(socket, :game, game)
    BackupAgent.put(name, game)
    IO.puts("----")
    IO.inspect(Game.client_view(game))
    IO.puts("----")
    {:reply, {:ok, %{ "game" => Game.client_view(game)}}, socket}  
  end

  def handle_in("guess", %{"id" => id}, socket) do
    IO.puts("guess")
    name = socket.assigns[:name]
    game = Game.guess(socket.assigns[:game], id)
    socket = assign(socket, :game, game)
    BackupAgent.put(name, game)
    IO.puts("----")
    IO.inspect(Game.client_view(game))
    IO.puts("----")
    {:reply, {:ok, %{ "game" => Game.client_view(game)}}, socket}
  end


  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (games:lobby).
  def handle_in("shout", payload, socket) do
    broadcast socket, "shout", payload
    {:noreply, socket}
  end
  defp authorized?(_payload) do
    true
  end
end
