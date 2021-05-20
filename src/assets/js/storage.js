
export default class Storage {
    static saveSearchHistory(search){
        let history = Storage.loadSearchHistory()
        for (const v in Object.keys(history)) {
            if (history[v].label === search.label){
                return
            }
        }
        history.unshift(search)
        history = Array.from(new Set(history))
        history = history.slice(0, 15)
        localStorage.setItem('searchHistory', JSON.stringify(history))
    }

    static loadSearchHistory(){
        let historyStr = localStorage.getItem('searchHistory')
        let history = JSON.parse(historyStr)
        return history || []
    }
}