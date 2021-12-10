
import axios from 'axios';
import { Registry, RegistryResultItem } from "../registry";

export class WikiData extends Registry {

    private user:string;

    get name() {
        return 'wikidata.org';
    }
    
    constructor(config:any) {
        super(config);
        this.user = config.user;
    }

    async query(key:string) {
        const results:RegistryResultItem[] = [];
        
        // const response = await axios.get(`http://api.geonames.org/searchJSON?formatted=true&q=${encodeURIComponent(key)}&maxRows=100&&username=${this.user}&style=full`);
        const response = await axios.get(`https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(key)}&language=pl&format=json`)
        if (response.status !== 200) {
            return {
                totalItems: 0,
                items: []
            };
        }
        const json:any = response.data;
        json.search.forEach((item:any) => {
            const result:RegistryResultItem = {
                register: this._register,
                id: item.id,
                label: item.label,
                details: item.description,
                link: `https://www.wikidata.org/wiki/${item.id}`
            };
            results.push(result);
        });
        return {
            totalItems: json.totalResultsCount,
            items: results
        };
    }
}