import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";

type Pokemon = {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
}

export default function PokemonApp() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [search, setSearch] = useState<string>("");
  const [offset, setOffset] = useState<number>(0);
  const limit = 52;

  useEffect(() => {
    async function fetchPokemons() {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
        const data = await response.json();
        // console.log(data.results);
        const detailedData: Pokemon[] = await Promise.all(
          data.results.map(async (pokemon: { url: string}) => {
            const res = await fetch(pokemon.url);
            // console.log(pokemon.url);
            return await res.json();
          })
        );
        setPokemons(detailedData);
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
      }
    }
    fetchPokemons();
  }, [offset]);

  const filteredPokemons = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Pokédex</h1>
      <Input
        type="text"
        placeholder="Search Pokémon..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredPokemons.map((pokemon) => (
          <Card key={pokemon.id} className="p-4 bg-white shadow-lg rounded-lg">
            <img
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              className="w-full h-32 object-contain mb-2"
            />
            <CardContent className="text-center">
              <h2 className="text-lg font-semibold capitalize">{pokemon.name}</h2>
              <p className="text-gray-600">ID: {pokemon.id}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex justify-between mt-4">
        <Button
          onClick={() => setOffset((prev) => Math.max(prev - limit, 0))}
          disabled={offset === 0}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Previous
        </Button>
        <Button
          onClick={() => setOffset((prev) => prev + limit)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
