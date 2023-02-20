export interface MyRow {
    a: number;
    b: number;
    c: number;
}

export interface Person {
    name: string;
    nickname: string;
    age: number;
    favColor: string;
    description: string;
}

interface ProgrammingLanguage {
  name: string;
  version: string;
  releaseDate: string;
  popularity: number;
  website: string;
  creator: string;
  firstAppeared: number;
  logo: string;
}

export interface Movie {
    title: string;
    year: number;
    imdb_id: string;
    actors: string;
    aka: string;
    imdb_url: string;
    imdb_iv: string;
    img_poster: string;
    photo_width: number;
    photo_height: number;
}
