import type { Movie } from "./types";

export async function searchMovies(query: string): Promise<Movie[]> {
    if (query == undefined || query.length == 0) {
        return [];
    }
    const url = new URL("https://search.imdbot.workers.dev")
    url.searchParams.set("q", query);

    const result = await (await fetch(url)).json();

    return result.description.map((res: any) => {
        return {
            title: res["#TITLE"],
            year: res["#YEAR"],
            imdb_id: res["#IMDB_ID"],
            actors: res["#ACTORS"],
            aka: res["#AKA"],
            imdb_url: res["#IMDB_URL"],
            imdb_iv: res["#IMDB_IV"],
            img_poster: res["#IMG_POSTER"],
            photo_width: res["photo_width"],
            photo_height: res["photo_height"]
        };
    });
}
