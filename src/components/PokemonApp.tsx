import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";

type PokemonType = {
  type: {
    name: string;
  };
};

type Pokemon = {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  types: PokemonType[];
};

export default function PokemonApp() {
  const colors: Record<string, string> = {
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD",
  };

  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [search, setSearch] = useState<string>("");
  const [offset, setOffset] = useState<number>(0);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const limit = 52;

  useEffect(() => {
    async function fetchPokemons() {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
        );
        const data = await response.json();
        const detailedData: Pokemon[] = await Promise.all(
          data.results.map(async (pokemon: { url: string }) => {
            const res = await fetch(pokemon.url);
            return await res.json();
          })
        );
        console.log(
          detailedData.map((pokemon) => colors[pokemon.types[0].type.name])
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
  const handleCardClick = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
  };

  const handleClose = () => {
    setSelectedPokemon(null);
  };

  function getContrastBorder(hex: string) {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? "#000000" : "#FFFFFF"; // Use black if light, white if dark
  }

  return (
    <div className="w-full h-full bg-gray-900">
      <div className={`p-6 max-w-5xl mx-auto`}>
        <h1 className="text-3xl font-bold mb-4 text-center text-red-500">
          Pokédex
        </h1>
        <Input
          type="text"
          placeholder="Search Pokémon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 mb-4 bg-black text-red-500 border rounded"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {filteredPokemons.map((pokemon) => (
            <Card
              key={pokemon.id}
              style={{
                background: `linear-gradient(135deg, ${
                  colors[pokemon.types[0].type.name]
                } 30%, #ffffff40)`,
                position: "relative",
                overflow: "hidden",
                border: `3px solid ${getContrastBorder(
                  colors[pokemon.types[0].type.name]
                )}`, // Contrast border
                boxShadow: `0 0 12px ${colors[pokemon.types[0].type.name]}`,
                transition:
                  "border 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease",
              }}
              className="p-4 text-white shadow-lg rounded-lg transform cursor-pointer hover:scale-105"
              onMouseEnter={(e) => {
                e.currentTarget.style.border = `5px solid ${getContrastBorder(
                  colors[pokemon.types[0].type.name]
                )}`;
                e.currentTarget.style.boxShadow = `0 0 20px ${
                  colors[pokemon.types[0].type.name]
                }`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.border = `3px solid ${getContrastBorder(
                  colors[pokemon.types[0].type.name]
                )}`;
                e.currentTarget.style.boxShadow = `0 0 12px ${
                  colors[pokemon.types[0].type.name]
                }`;
              }}
              onClick={() => handleCardClick(pokemon)}
            >
              {/* Glossy Shine Effect */}
              <div className="absolute inset-0 bg-white opacity-10 rounded-lg" />

              <img
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
                className="w-full h-32 object-contain mb-2"
              />
              <CardContent className="text-center relative z-10">
                <h2 className="text-md font-semibold capitalize">
                  {pokemon.name}
                </h2>
                <p className="text-white">ID: {pokemon.id}</p>
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
        {/* Modal for selected Pokémon */}
        {selectedPokemon && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={handleClose}
          >
            <div
              className="bg-gray-300 p-6 rounded-lg max-w-md w-full transform transition duration-500 scale-110"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedPokemon.sprites.front_default}
                alt={selectedPokemon.name}
                className="w-48 h-48 object-contain mb-4 mx-auto"
              />
              <h2 className="text-xl font-semibold text-center">
                {selectedPokemon.name.charAt(0).toUpperCase() +
                  selectedPokemon.name.slice(1)}
              </h2>
              <p className="text-gray-600 text-center">
                ID: {selectedPokemon.id}
              </p>
              <p className="text-gray-600 text-center">
                <strong>Type:</strong>{" "}
                {selectedPokemon.types
                  .map(
                    (type) =>
                      type.type.name.charAt(0).toUpperCase() +
                      type.type.name.slice(1)
                  )
                  .join(" | ")}
              </p>
              <Button
                onClick={handleClose}
                className="mt-4 px-6 py-2 bg-red-500 text-white rounded block mx-auto"
              >
                Close
              </Button>
            </div>
          </div>
        )}
        {/* Modal for selected Pokémon */}
        {selectedPokemon && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50"
            onClick={handleClose}
          >
            <div
              className="bg-gray-200 p-6 rounded-lg max-w-md w-full transform transition duration-500 scale-110 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedPokemon.sprites.front_default}
                alt={selectedPokemon.name}
                className="w-48 h-48 object-contain mb-4 mx-auto"
              />
              <h2 className="text-xl font-semibold text-center text-black">
                {selectedPokemon.name.charAt(0).toUpperCase() +
                  selectedPokemon.name.slice(1)}
              </h2>
              <p className="text-gray-700 text-center">
                <strong>ID:</strong> {selectedPokemon.id}
              </p>
              <p className="text-gray-700 text-center">
                <strong>Type:</strong>{" "}
                {selectedPokemon.types
                  .map(
                    (type) =>
                      type.type.name.charAt(0).toUpperCase() +
                      type.type.name.slice(1)
                  )
                  .join(" | ")}
              </p>
              <Button
                onClick={handleClose}
                className="mt-4 px-6 py-2 bg-red-500 text-white rounded block mx-auto hover:bg-red-600 transition"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
