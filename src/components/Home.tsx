import React, { useEffect, useState } from "react";
import { useTaskSlice } from "../app/useTaskSlice";
import {
	Button,
	FormCheck,
	FormControl,
	OverlayTrigger,
	Tooltip,
} from "react-bootstrap";

const Home = () => {
	const { addTask, editTask, removeTask, fetchTask, tasks, loading, error } =
		useTaskSlice();
	const [showEmptyTaskMessage, setShowEmptyTaskMessage] = useState(false);
	const [editingTaskId, setEditingTaskId] = useState<Number | null>(null);
	const [currentTime, setCurrentTime] = useState(new Date());

	useEffect(() => {
		fetchTask();

		if (showEmptyTaskMessage) {
			const timeoutId = setTimeout(() => {
				setShowEmptyTaskMessage(false);
			}, 2500);

			return () => clearTimeout(timeoutId);
		}

		const intervalId = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);

		return () => clearInterval(intervalId);
	}, [showEmptyTaskMessage]);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const input = (e.target as HTMLFormElement).querySelector(
			"input"
		) as HTMLInputElement;
		const task = {
			id: Date.now(),
			title: input.value,
			completed: false,
		};

		if (task.title.trim() !== "") {
			addTask(task);
			setShowEmptyTaskMessage(false); // Reset message visibility
			input.value = ""; // Reset input value
		} else {
			setShowEmptyTaskMessage(true); // Show message for empty task
		}

		const taskTime = new Date();
		taskTime.toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
			second: "numeric",
		});
	};

	const taskTime = new Date();
	taskTime.toLocaleDateString("en-US", {
		hour: "numeric",
		minute: "numeric",
		second: "numeric",
	});

	return (
		<div>
			<div className="containerBox">
				<div style={{ textAlign: "center" }}>
					<span style={{ color: "yellow" }}>
						{currentTime.toLocaleDateString("en-US", {
							weekday: "long",
							year: "numeric",
							month: "long",
							day: "numeric",
							hour: "numeric",
							minute: "numeric",
							second: "numeric",
						})}
					</span>
				</div>

				<div className="text-center">
					<h1>TODO APP</h1>
					<span>
						by <strong style={{ color: "yellow" }}>Shahboz Nabiyev</strong>
					</span>
				</div>
				<form
					style={{
						margin: "60px auto",
						width: "800px",
					}}
					onSubmit={handleSubmit}>
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							gap: "15px",
							margin: "0 auto",
						}}>
						<div style={{ display: "flex", flexDirection: "column" }}>
							<FormControl type="text" className="w-100" />
						</div>
						<Button variant="success" type="submit">
							Add
						</Button>
					</div>
					<span
						style={
							showEmptyTaskMessage
								? { display: "block", color: "red" }
								: { display: "none", color: "transparent" }
						}>
						Please type a task...
					</span>
				</form>

				<div className="">
					{loading && <div>Loading...</div>}
					{error && <div>{error.message}</div>}
					{tasks.map((task, i) => (
						<div
							key={task.id}
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								marginBottom: "15px",
							}}>
							<div>
								{editingTaskId === task.id ? (
									<div style={{ display: "flex" }}>
										<FormCheck
											style={{}}
											type="checkbox"
											checked={task.completed}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
												task.completed = e.target.checked;
												editTask(task, task.id);
											}}
										/>
										<input
											type="text"
											style={{ width: 600, marginLeft: "40px" }}
											value={task.title}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
												task.title = e.target.value;
												editTask(task, task.id);
											}}
											onBlur={() => {
												setEditingTaskId(null);
												editTask(task, task.id);
											}}
											onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
												if (e.key === "Enter") {
													setEditingTaskId(null);
												}
											}}
										/>
									</div>
								) : (
									<div
										style={{
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",
											gap: "20px",
										}}
										onDoubleClick={() => setEditingTaskId(task.id)}>
										<FormCheck
											style={{}}
											type="checkbox"
											checked={task.completed}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
												task.completed = e.target.checked;
												editTask(task, task.id);
											}}
										/>

										{["top"].map((placement) => (
											<OverlayTrigger
												key={placement}
												overlay={
													<Tooltip id={`tooltip-${placement}`}>
														Double Click to edit
													</Tooltip>
												}>
												<span
													style={
														task.completed
															? {
																	textDecoration: "line-through",
																	opacity: "0.4",
															  }
															: {
																	textDecoration: "none",
															  }
													}>
													{i + 1}. {task.title}
												</span>
											</OverlayTrigger>
										))}
									</div>
								)}
							</div>

							<div>
								<span
									style={{
										fontSize: "10px",
										marginRight: "10px",
									}}>
									{taskTime.toDateString()}
								</span>

								<Button
									variant="outline-danger"
									size="sm"
									onClick={() => removeTask(task.id)}>
									Remove
								</Button>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Home;
