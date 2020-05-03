class Pmf {
    constructor() {
        //   this.name = name;
        this.d = {};

    }
    Odds(p) {
        // возвращает шансы из вероятности
        // Computes odds for a given probability.
        // Example: p=0.75 means 75 for and 25 against, or 3:1 odds in favor.
        // Note: when p=1, the formula for odds divides by zero, which is
        // normally undefined.  But I think it is reasonable to define Odds(1)
        // to be infinity, so that's what this function does.
        // p: float 0-1
        // Returns: float odds
        if (p === 1) {
            return 0;
        }
        return p / (1 - p)
    }
    Probability(o) {
        // возвращает из шансов вероятность
        // Computes the probability corresponding to given odds.
        // Example: o=2 means 2:1 odds in favor, or 2/3 probability
        // o: float odds, strictly positive
        // Returns: float probability
        return o / (o + 1)
    }
    Probability2(yes, no) {
        // возвращает вероятность из шансов 
        // Computes the probability corresponding to given odds.
        // Example: yes=2, no=1 means 2:1 odds in favor, or 2/3 probability.
        // yes, no: int or float odds in favor
        return (yes) / (yes + no)
    }
    set(name, prior) {
        this.d[name] = prior
        // console.log(this.d)
    }
    mult(name, factor) {
        this.d[name] = this.d[name] * factor
        // console.log(this.d)
    }
    total() {
        // возвращает сумму вероятностей всех гипотез
        let total = 0;
        for (let key in this.d) {
            total += this.d[key]
        }
        // console.log(`сумма вероятностей ${total}`)
        return total
    }
    normalize(fraction = 1) {
        // нормализует вероятность делит каждую вероятность которая может быть представлена
        // в виде частоты слова в предложении например, на общую вероятность или всех слов в предложении
        let total = this.total();
        if (total !== 0) {
            let factor = fraction / total;
            for (let key in this.d) {
                this.d[key] *= factor
            }
        }
        // console.log(`результат после нормализации сумма вероятностей ${total}`)
        return total
    }
    prob(x) {
        // Gets the probability associated with the value x.
        // Args:
        //     x: number value
        //     default: value to return if the key is not there
        // Returns:
        //     float probability
        console.log(`вероятность гипотезы ${x} равна ${this.d[x]}`)
        return this.d[x]
    }
}

class Cookie extends Pmf {
    constructor(hypos) {
        super()//инициализируем родительский конструктор в котором создаем обьект d с вероятностями
        // для каждой гипотезы создаем вероятность, если число одинаковое то события равновероятны
        for (let hypo of hypos) {
            this.set(hypo, 1)
        }
        this.normalize()
    }
    // задаем распределение в корзинах с булками
    mixes = {
        'bowl11': { "vanilla": 0.75, "chocolate": 0.25 },
        'bowl22': { "vanilla": 0.5, "chocolate": 0.5 },
    }
    // получаем вероятность вытащить определенную булку для гипотезы по сути правдоподобие
    likelyhood(data, hypo) {
        const mix = this.mixes[hypo]
        const like = mix[data]
        return like
    }
    update(data) {
        // Updates the PMF with new data.
        // data: string cookie type
        for (let hypo of Object.keys(this.d)) {
            let like = this.likelyhood(data, hypo)
            this.mult(hypo, like)
        }
        this.normalize()
    }


}

class Monty extends Pmf {
    constructor(hypos) {
        super()//инициализируем родительский конструктор в котором создаем обьект d с вероятностями
        for (let hypo of hypos) {
            this.set(hypo, 1)
        }
        this.normalize()
    }

    /**
    * Возвращает правдоподобие получить машину за дверью для гипотез 
    * @param {string} data дверь которую можно открыть
    * @param {string} hypo гипотеза за какой дверью машина
    * @return {number} вероятность получить машину за дверью по сути правдоподобие
    */
    likelyhood(data, hypo) {
        if (hypo === data) {//дверь которую открыли
            return 0
        } else if (hypo === 'A') {
            return 0.5
        } else {
            return 1
        }
    }
    /**
    * Возвращает вероятность получить машину за дверью 
    * @param {string} data дверь которую откроет монти
    */
    update(data) {
        // Updates the PMF with new data.
        // data: string cookie type
        for (let hypo of Object.keys(this.d)) {
            let like = this.likelyhood(data, hypo)
            this.mult(hypo, like)
        }
        this.normalize()
    }
}

class Suite extends Pmf {
    constructor(hypos) {
        super()//инициализируем родительский конструктор в котором создаем обьект d с вероятностями
        for (let hypo of hypos) {
            this.set(hypo, 1)
        }
        this.normalize()
    }
    /**
     * Изменяет каждую гипотезу на основе новых данных 
     * @param {string} data данные которые меняют вероятность гипотезы
     */
    update(data) {
        // Updates the PMF with new data.
        // data: string cookie type
        for (let hypo of Object.keys(this.d)) {
            let like = this.likelyhood(data, hypo)
            this.mult(hypo, like)
        }
        this.normalize()
    }
    /**
        * выводит вероятности гипотез
        */
    print() {
        for (let hypo of Object.keys(this.d)) {
            this.prob(hypo)
        }
    }
}

class Monty2 extends Suite {
    likelyhood(data, hypo) {
        if (hypo === data) {//дверь которую открыли
            return 0
        } else if (hypo === 'A') {
            return 0.5
        } else {
            return 1
        }
    }
}
export { Pmf, Cookie, Monty, Suite, Monty2 }