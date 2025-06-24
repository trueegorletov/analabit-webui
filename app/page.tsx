"use client";
import { useEffect, useState } from "react";
import { gsap } from "gsap";

declare global {
	interface Window {
		gsap: any;
	}
}

interface Direction {
	name: string;
	score: number;
	rank: string;
	range: string;
}

interface University {
	name: string;
	directions: Direction[];
}

const universities: University[] = [
	{
		name: "МФТИ",
		directions: [
			{ name: "Математика", score: 283, rank: "#12", range: "283..271" },
			{
				name: "Прикладная математика и информатика",
				score: 272,
				rank: "#73",
				range: "272..259",
			},
			{ name: "Геология", score: 301, rank: "#127", range: "301..290" },
			{ name: "Науки о данных", score: 290, rank: "#34", range: "290..280" },
			{ name: "История", score: 265, rank: "#54", range: "265..250" },
			{ name: "Физика", score: 275, rank: "#23", range: "275..260" },
		],
	},
	{
		name: "МГУ",
		directions: [
			{ name: "История", score: 265, rank: "#54", range: "265..250" },
			{ name: "Филология", score: 280, rank: "#60", range: "280..270" },
			{ name: "Политология", score: 258, rank: "#45", range: "258..245" },
			{ name: "Журналистика", score: 290, rank: "#33", range: "290..275" },
			{ name: "Экономика", score: 275, rank: "#67", range: "275..265" },
			{
				name: "Международные отношения",
				score: 295,
				rank: "#28",
				range: "295..285",
			},
		],
	},
	{
		name: "СПбГУ",
		directions: [
			{
				name: "Программная инженерия",
				score: 285,
				rank: "#42",
				range: "285..270",
			},
			{ name: "Биология", score: 260, rank: "#78", range: "260..245" },
			{ name: "Химия", score: 268, rank: "#55", range: "268..255" },
			{ name: "Физика", score: 277, rank: "#39", range: "277..265" },
		],
	},
	{
		name: "ВШЭ",
		directions: [
			{
				name: "Бизнес-информатика",
				score: 295,
				rank: "#25",
				range: "295..280",
			},
			{ name: "Менеджмент", score: 270, rank: "#68", range: "270..255" },
			{
				name: "Прикладная математика",
				score: 288,
				rank: "#31",
				range: "288..275",
			},
			{ name: "Дизайн", score: 255, rank: "#82", range: "255..240" },
		],
	},
];

const UniversityBlock = ({ university }: { university: University }) => {
	const [expanded, setExpanded] = useState(false);

	return (
		<div className="university-block">
			<div className="block-header">
				<h3>{university.name}</h3>
				<button className="info-btn">
					ℹ
					<div className="tooltip">
						Баллы – проходные баллы; № – рейтинг последнего зачисленного;
						диапазон – прогноз изменения балла.
					</div>
				</button>
			</div>
			<table className="directions-table">
				<tbody>
					{university.directions
						.slice(
							0,
							expanded ? university.directions.length : 4
						)
						.map((dir: Direction, index: number) => (
							<tr key={index}>
								<td className="dir-name">
									<a href="#">{dir.name}</a>
								</td>
								<td className="score">{dir.score}</td>
								<td className="rank">{dir.rank}</td>
								<td className="range">{dir.range}</td>
							</tr>
						))}
				</tbody>
			</table>
			{!expanded && university.directions.length > 4 && (
				<button
					className="expand-btn"
					onClick={() => setExpanded(true)}
				>
					Показать все
				</button>
			)}
		</div>
	);
};

export default function Home() {
	useEffect(() => {
		const palettes = [
			{
				grad: "linear-gradient(120deg, rgba(255, 94, 98, 0.6), rgba(255, 153, 102, 0.6))",
				glow: "rgba(255, 120, 99, 0.3)",
			},
			{
				grad: "linear-gradient(120deg, rgba(95, 114, 190, 0.6), rgba(102, 153, 255, 0.6))",
				glow: "rgba(98, 135, 229, 0.3)",
			},
			{
				grad: "linear-gradient(120deg, rgba(125, 226, 252, 0.6), rgba(102, 153, 255, 0.6))",
				glow: "rgba(110, 190, 253, 0.3)",
			},
			{
				grad: "linear-gradient(120deg, rgba(255, 153, 102, 0.6), rgba(95, 114, 190, 0.6))",
				glow: "rgba(177, 135, 142, 0.3)",
			},
			{
				grad: "linear-gradient(120deg, rgba(255, 94, 98, 0.6), rgba(125, 226, 252, 0.6))",
				glow: "rgba(191, 143, 179, 0.3)",
			},
		];

		const tags = gsap.utils.toArray(".tag");
		tags.forEach((tag: any) => {
			const palette = palettes[Math.floor(Math.random() * palettes.length)];
			gsap.set(tag, {
				background: palette.grad,
				backgroundSize: "200% 200%",
			});
			gsap.to(tag, {
				backgroundPosition: "100% 100%",
				duration: gsap.utils.random(10, 15),
				repeat: -1,
				yoyo: true,
				ease: "sine.inOut",
			});
			gsap.to(tag, {
				boxShadow: `0 0 18px 3px ${palette.glow}, 0 0 8px 1px rgba(255, 255, 255, 0.1)`,
				duration: gsap.utils.random(6, 10),
				repeat: -1,
				yoyo: true,
				ease: "sine.inOut",
				delay: gsap.utils.random(0, 2),
			});
		});
		tags.forEach((tag: any, index: number) => {
			const amplitude = gsap.utils.random(3, 8);
			const duration = gsap.utils.random(4, 7);
			const delay = (index % 5) * 0.3;
			gsap.to(tag, {
				y: -amplitude,
				duration: duration,
				repeat: -1,
				yoyo: true,
				ease: "sine.inOut",
				delay: delay,
			});
		});
	}, []);

	return (
		<>
			<div className="container">
				<div className="tags">
					<div className="tag">МФТИ</div>
					<div className="tag">МГУ</div>
					<div className="tag">СПбГУ</div>
					<div className="tag">ВШЭ</div>
					<div className="tag">ИТМО</div>
					<div className="tag">ТГУ</div>
					<div className="tag">ЮФУ</div>
					<div className="tag">НГУ</div>
					<div className="tag">ТПУ</div>
					<div className="tag">МЭИ</div>
					<div className="tag">РУДН</div>
					<div className="tag">КФУ</div>
					<div className="tag">ДВФУ</div>
					<div className="tag">РАНХиГС</div>
					<div className="tag">СПбГЭТУ</div>
					<div className="tag">РГГУ</div>
					<div className="tag">МИЭТ</div>
					<div className="tag">ПНИПУ</div>
					<div className="tag">НИУ МИЭТ</div>
					<div className="tag">СФУ</div>
					<div className="tag">ТюмГУ</div>
					<div className="tag">НИЯУ МИФИ</div>
				</div>
				<div className="wave-container">
					<svg
						className="wave"
						viewBox="0 0 900 300"
						preserveAspectRatio="none"
					>
						<defs>
							<linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
								<stop offset="0%" style={{ stopColor: "#ff5e62" }} />
								<stop offset="50%" style={{ stopColor: "#ff9966" }} />
								<stop offset="100%" style={{ stopColor: "#5f72be" }} />
							</linearGradient>
						</defs>
						<path fill="url(#grad)">
							<animate
								attributeName="d"
								dur="6s"
								repeatCount="indefinite"
								values="
            M0,150 C150,100 300,200 450,150 C600,100 750,200 900,150 L900,300 L0,300 Z;
            M0,150 C150,200 300,100 450,200 C600,300 750,100 900,200 L900,300 L0,300 Z;
            M0,150 C150,100 300,200 450,150 C600,100 750,200 900,150 L900,300 L0,300 Z
          "
							/>
						</path>
					</svg>
				</div>
				<div className="title">Проверка статуса поступления</div>
				<div className="desc">
					Введите ID абитуриента, чтобы узнать, в какие университеты он
					зачислен
				</div>
				<div className="input-group">
					<input type="text" placeholder="ID студента" />
					<button>Проверить</button>
				</div>
			</div>

			<div className="container results-container">
				<h2 className="results-title">Результаты по направлениям</h2>
				{universities.map((uni, index) => (
					<UniversityBlock key={index} university={uni} />
				))}
			</div>
		</>
	);
}
