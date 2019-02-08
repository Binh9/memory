defmodule Memory.Game do

  def new do
    state = 
    %{
      tiles: [],
      tilesLeft: 16, 
      numClicks: 0,
      openID: -1
     }

     values = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
     randValues = Enum.shuffle(values)
      |> Enum.with_index()

     outArr = Enum.map(randValues, fn {x, id} -> %{id: id, value: x, visible: false, done: false} end)

     Map.put(state, :tiles, outArr)
  end

  def client_view(game) do
    %{
      tiles: game.tiles,
      tilesLeft: game.tilesLeft,
      numClicks: game.numClicks,
      openID: game.openID
    }
  end

  # For reseting
  def reset(game) do
    new()
  end

  # Reveal the clicked tile
  def reveal(game, id) do
    # Get the tile at the given id
    tile = Enum.at(game.tiles, id)
    tile = Map.put(tile, :visible, true)
    # Replace with the updated tile
    newTiles = List.replace_at(game.tiles, id, tile)
    game = Map.put(game, :tiles, newTiles)
  end
  
  // Handle the click
  def guess(game, id) do
    if (game.openID == -1) do
      # First tile is selected
      game = Map.put(game, :openID, id)
        |> Map.put(:numClicks, game.numClicks + 1)
    else
      # Second tile is selected
      # TODO + screen freezing
      Process.sleep(1000)
      game = handleMatching(game, id, game.openID)
        |> Map.put(:numClicks, game.numClicks + 1)
    end
  end

  # Given the two different ids, determines if there is matching or not
  # and performs corresponding actions
  def handleMatching(game, id1, id2) do
    tile1 = Enum.at(game.tiles, id1)
    tile2 = Enum.at(game.tiles, id2)
    if (tile1.value == tile2.value) do
      # Good match
      tile1 = Map.put(tile1, :done, true)
      tile2 = Map.put(tile2, :done, true)
      newTiles = List.replace_at(game.tiles, id1, tile1)
        |> List.replace_at(id2, tile2)

      game = Map.put(game, :tiles, newTiles)
        |> Map.put(:tilesLeft, game.tilesLeft - 2)
    else
      # Bad match
      tile1 = Map.put(tile1, :visible, false)
      tile2 = Map.put(tile2, :visible, false)
      newTiles = List.replace_at(game.tiles, id1, tile1)
        |> List.replace_at(id2, tile2)

      game = Map.put(game, :tiles, newTiles)
    end
  end


end 
