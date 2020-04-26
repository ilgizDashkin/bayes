import React, { Component } from 'react';
import '@vkontakte/vkui/dist/vkui.css';
import { View, Panel, PanelHeader, FormLayout, Button, Input, CardGrid, Card, Link, Group, Header } from '@vkontakte/vkui';//пакеты из вк
// import Icon24CameraOutline from '@vkontakte/icons/dist/24/camera_outline';//это из https://vkcom.github.io/icons/#24/smile
// import Icon24Send from '@vkontakte/icons/dist/24/send';
// import Icon24Smile from '@vkontakte/icons/dist/24/smile';
// import 'bootstrap/dist/css/bootstrap.min.css'
// import './App.css'
import Icon28StatisticsOutline from '@vkontakte/icons/dist/28/statistics_outline';
import Icon24Forward10 from '@vkontakte/icons/dist/24/forward_10';
// import AnyChart from 'anychart-react'
// import iconv from 'iconv-lite'
// import Parser from 'rss-parser'

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			vanil_basket1: '',
			chocolate_basket1: '',
			vanil_basket2: '',
			chocolate_basket2: '',
			calc: null,
			yellow1: '',
			green1: '',
			yellow2: '',
			green2: '',
			posterior1: null,
			posterior2: null,
		}
	}

	componentDidMount() {
		//вызываем предыдущее состояние из локалсториджа
		const lastState = localStorage.bayes
		if (lastState) {
			// console.log(lastState)
			this.setState(JSON.parse(lastState))
		}
	}

	//обязательно используем стрелочные фунции чтоб не прописывать методы в конструкторе
	vanil_basket1Change = (event) => {
		this.setState({ vanil_basket1: Number(event.target.value) });
	}
	chocolate_basket1Change = (event) => {
		this.setState({ chocolate_basket1: Number(event.target.value) });
	}
	vanil_basket2Change = (event) => {
		this.setState({ vanil_basket2: Number(event.target.value) });
	}
	chocolate_basket2Change = (event) => {
		this.setState({ chocolate_basket2: Number(event.target.value) });
	}
	onClickHandler = () => {
		if (Number(this.state.vanil_basket1) && Number(this.state.vanil_basket2) && Number(this.state.chocolate_basket1) && Number(this.state.chocolate_basket2)) {
			let p_basket1 = 0.5;//вероятность выбора 1 корзины из 2-х возможных
			let p_vanil_basket1 = (this.state.vanil_basket1 / (this.state.chocolate_basket1 + this.state.vanil_basket1)).toFixed(2);//вероятность ванильной печеньки в корзине 1
			//вероятность ванильной печеньки во всех корзинах
			let p_vanil_all_baskets = ((this.state.vanil_basket1 + this.state.vanil_basket2) / (this.state.vanil_basket1 + this.state.vanil_basket2 + this.state.chocolate_basket1 + this.state.chocolate_basket2)).toFixed(2);
			let p_basket1_vanil = (p_basket1 * p_vanil_basket1) / p_vanil_all_baskets;//Байесовская вероятность что печенька из 1 корзины, если она ванильная
			console.log(p_vanil_basket1)
			console.log(p_vanil_all_baskets)
			this.setState({
				calc: `Байесовская вероятность что булочка из 1 корзины, если она ванильная ${((p_basket1_vanil) * 100).toFixed(2)}% `
			})
			localStorage.bayes = JSON.stringify(this.state);//сохраняем стейт в локалсторадже
		} else {
			this.setState({
				vanil_basket1: '',
				chocolate_basket1: '',
				vanil_basket2: '',
				chocolate_basket2: '',
				calc: null
			})
		}
	}
	yellow1Change = (event) => {
		this.setState({ yellow1: Number(event.target.value) });
	}
	green1Change = (event) => {
		this.setState({ green1: Number(event.target.value) });
	}
	yellow2Change = (event) => {
		this.setState({ yellow2: Number(event.target.value) });
	}
	green2Change = (event) => {
		this.setState({ green2: Number(event.target.value) });
	}
	mm_ClickHandler = () => {
		if (Number(this.state.yellow1) && Number(this.state.yellow1) && Number(this.state.green1) && Number(this.state.green2)) {
			let prior = 0.5;//приор вероятность гипотезы до получения новых данных гипотезы равновероятны
			let believ1 = (this.state.yellow1 * this.state.green1).toFixed(2);//правдоподобие для  гипотезы 1
			let believ2 = (this.state.yellow2 * this.state.green2).toFixed(2);//правдоподобие для  гипотезы 2
			let normal_const = (believ1 * prior + believ2 * prior).toFixed(2);//вероятность данных для любой из гипотез, носящей название нормализующей константы сумма всех вероятностей
			//вероятность гипотезы 1
			let posterior1 = ((believ1 * prior) / normal_const).toFixed(2);//Байесовская вероятность вероятность гипотезы 1
			let posterior2 = ((believ2 * prior) / normal_const).toFixed(2);//Байесовская вероятность вероятность гипотезы 2
			console.log(posterior1)
			console.log(posterior2)
			this.setState({
				posterior1: `Байесовская вероятность что желтое из 1994, зеленое из 1996г ${((posterior1) * 100).toFixed(2)}% `,
				posterior2: `Байесовская вероятность что желтое из 1996, зеленое из 1994г ${((posterior2) * 100).toFixed(2)}% `
			})
			localStorage.bayes = JSON.stringify(this.state);//сохраняем стейт в локалсторадже
		} else {
			this.setState({
				green1: '',
				yellow2: '',
				green2: '',
				posterior1: null,
				posterior2: null,
			})
		}
	}
	render() {
		return (
			<View id="view" activePanel="panel">
				<Panel id="panel">
					<PanelHeader>задачи на теорию Байеса</PanelHeader>
					<Group header={<Header mode="secondary">задача о булочках</Header>}>
						<FormLayout align="center">
							<CardGrid>
								<Card size="l" mode="outline">
									Задача о булочках. Предположим, что имеется две корзины с булочками. В корзине под номером 1 лежит 30 ванильных
									и 10 шоколадных булочек, a в корзине под номером 2 лежит по 20 булочек обоих сортов. Вы случайным образом выбираете одну из корзин
									и, не заглядывая внутрь, берете первую попавшуюся булочку. Ею оказывается
									ванильная булочка. Какова вероятность, что он выбрана из корзины 1?
								</Card>
							</CardGrid>
							<Input type="number" top="корзина 1 число ванильных булочек" placeholder='ванильные' align="center" value={this.state.vanil_basket1} onChange={this.vanil_basket1Change} />
							<Input type="number" top="корзина 1 число шоколадных булочек" placeholder='шоколадные' align="center" value={this.state.chocolate_basket1} onChange={this.chocolate_basket1Change} />
							<Input type="number" top="корзина 2 число ванильных булочек" placeholder='ванильные' align="center" value={this.state.vanil_basket2} onChange={this.vanil_basket2Change} />
							<Input type="number" top="корзина 2 число шоколадных булочек" placeholder='шоколадные' align="center" value={this.state.chocolate_basket2} onChange={this.chocolate_basket2Change} />
							<Button onClick={this.onClickHandler} before={<Icon28StatisticsOutline />} size="l">вычислить</Button>
							{this.state.calc ?
								<CardGrid>
									<Card size="l" mode="outline">
										{`Для решения задачи: (находим вероятность выбора корзины 1 она составляет 0.5 умножаем вероятность выбора ванильной булочки из корзины 1 она будет (ванильные корзина 1/шоколадные корзина 1)) делим на
									вероятность выбора ванильной булочки из обеих корзин она будет (всего ванильных/всего шоколадных) и получаем в результате. ${this.state.calc}`}
									</Card>
								</CardGrid> : null}
						</FormLayout>
					</Group>
					<Group header={<Header mode="secondary">задача о M&M</Header>}>
						<FormLayout align="center">
							<CardGrid>
								<Card size="l" mode="outline">
									В 1995 году драже окрашивались в синий цвет. До этого пакетик M&M содер
									жал драже следующих цветов: 30% коричневых, 20% желтых, 20% красных, 10%
									зеленых, 10% оранжевых и 10% желто-коричневых. В дальнейшем цвета драже
									были изменены следующим образом: 24% синих, 20% зеленых, 16% оранжевых, 14% желтых, 13% красных, 13% коричневых.
									Допустим, у моего приятеля было два пакетика M&M. Один пакетик 1994 года
									выпуска, а другой – 1996-го. Не сообщив, какой пакетик какого года выпуска,
									мой приятель дал мне по одному драже из каждого. Одно драже было желтым,
									другое – зеленым. Какова вероятность, что желтое драже было из пакетика
									1994 года выпуска?
								</Card>
							</CardGrid>
							<Input type="number" top="пачка 1 % желтых" placeholder='желтых' align="center" value={this.state.yellow1} onChange={this.yellow1Change} />
							<Input type="number" top="пачка 1 % зеленых" placeholder='зеленых' align="center" value={this.state.green1} onChange={this.green1Change} />
							<Input type="number" top="пачка 2 % желтых" placeholder='желтых' align="center" value={this.state.yellow2} onChange={this.yellow2Change} />
							<Input type="number" top="пачка 2% зеленых" placeholder='зеленых' align="center" value={this.state.green2} onChange={this.green2Change} />
							<Button onClick={this.mm_ClickHandler} before={<Icon28StatisticsOutline />} size="l">вычислить</Button>
							{this.state.calc ?
								<CardGrid>
									<Card size="l" mode="outline">
										{`Для решения задачи: нужно разделить на 2 гипотезы, 1 пачка 1994г 2 пачка 1996г и наоборот, затем найти вероятность события взятия 
										драже для каждого случая она равна 0.5 (это приор) оба случая равновероятны. 
									Находим правдоподобие для гипотез это произведение вероятностей драже зеленого и желтого. 
									Нормализующая константа равна для обоих гипотез равна (приор умноженный на правдоподобие в гипотезе 1 + приор умноженный на правдоподобие в гипотезе 2).									
									Результат будет для 1 гипотезы (приор1 умноженный на правдоподобие в гипотезе 1/нормализующая константа) и 
									для 2 гипотезы (приор2 умноженный на правдоподобие в гипотезе 2/нормализующая константа). ${this.state.posterior1}, ${this.state.posterior2}`}
									</Card>
								</CardGrid> : null}
						</FormLayout>
					</Group>
				</Panel>
			</View>
		);
	}
}

export default App;

