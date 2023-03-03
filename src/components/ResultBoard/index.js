import { useEffect, useRef } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { closeWebsocket, startWebsocket } from '../../net'
import { ChatBoard } from './ChatBoard'
import { DetailBoard } from './DetailBoard'
import { GenerateBoard } from './GenerateBoard'
import style from './result.module.css'
import {
	taskInitAtom,
	taskDetailAtom,
	chatHistoryAtom,
	chatGuessAtom,
	promptAtom,
	showDetailAtom,
	meshProfileAtom,
	assistantChatStatusAtom,
	guessChatStatusAtom,
	chatTextAtom,
} from './store.js'

function ResultBoard() {
	const navi = useNavigate()
	const taskInit = useRecoilValue(taskInitAtom)
	const taskDetail = useRecoilValue(taskDetailAtom)
	const [chatHistory, setChatHistory] = useRecoilState(chatHistoryAtom)
	const setChatGuess = useSetRecoilState(chatGuessAtom)
	const setMeshProfile = useSetRecoilState(meshProfileAtom)
	const setAssistantChatStatus = useSetRecoilState(assistantChatStatusAtom)
	const setGuessChatStatus = useSetRecoilState(guessChatStatusAtom)
	const [prompt, setPrompt] = useRecoilState(promptAtom)
	const showDetail = useRecoilValue(showDetailAtom)
	const isListenRef = useRef(false)
	const chatHistoryRef = useRef({})
	const chatGuessRef = useRef('')
	const promptRef = useRef('')

	const handleClose = (ev) => {
		// closeWebsocket()
		// disposeWebsocket()
		navi('/')
	}

	// const reset = () => {
	// 	setTaskInit(false)
	// 	setTaskDetail(false)
	// 	setChatHistory({})
	// 	setChatGuess([])
	// 	setPrompt('')
	// }

	useEffect(() => {
		chatHistoryRef.current = { ...chatHistory }
	}, [chatHistory])

	useEffect(() => {
		promptRef.current = prompt
	}, [prompt])

	useEffect(() => {
		if (showDetail) {
			closeWebsocket()
		}
	}, [showDetail])

	useEffect(() => {
		if (!taskInit && !taskDetail) {
			navi('/', { replace: true })
		}
		// eslint-disable-next-line
	}, [taskInit, taskDetail])

	useEffect(() => {
		if (!taskInit) return
		;(async () => {
			// console.log(isListenRef.current);
			if (isListenRef.current) return
			isListenRef.current = true

			const ws = await startWebsocket(taskInit.subscription)

			ws.on('assistant', (ev) => {
				const currentChat = { ...(chatHistoryRef.current[ev.chat_uuid] || {}) }
				setAssistantChatStatus(ev.content)

				if (ev.content === '[START]') {
					currentChat.chat_uuid = ev.chat_uuid
					currentChat.provider = ev.provider
					currentChat.timeStamp = new Date(ev.submit_time).getTime()
					currentChat.content = ''
				} else if (ev.content !== '[END]') {
					currentChat.content += ev.content
				}
				setChatHistory({ ...chatHistoryRef.current, [ev.chat_uuid]: currentChat })
			})

			ws.on('guess', (ev) => {
				setGuessChatStatus(ev.content)
				if (ev.content === '[START]') {
					chatGuessRef.current = ''
				} else if (ev.content !== '[END]') {
					chatGuessRef.current += ev.content
					setChatGuess(chatGuessRef.current.split('\n'))
				}
			})
			ws.on('summary', (ev) => {
				if (ev.content === '[START]') {
					promptRef.current = ''
				} else if (ev.content !== '[END]') {
					promptRef.current += ev.content
					setPrompt(promptRef.current)
				}
			})
		})()
		// eslint-disable-next-line
	}, [taskInit])

	useEffect(() => {
		if (!taskDetail) return
		setChatHistory(
			taskDetail.chat_history.reduce(
				(res, cur) => ({
					...res,
					[cur.chat_uuid]: { ...cur, timeStamp: new Date(cur.time).getTime() },
				}),
				{}
			)
		)
		setPrompt(taskDetail.prompt)
		setMeshProfile(taskDetail.resource_uuid)
		navi('/result/detail')
		// eslint-disable-next-line
	}, [taskDetail])

	return (
		<div className={style.con} onPointerDown={handleClose}>
			<div className={style.board} onPointerDown={(ev) => ev.stopPropagation()}>
				<Outlet />
				<ChatBoard />
			</div>
		</div>
	)
}

export { ResultBoard, GenerateBoard, DetailBoard, taskInitAtom, taskDetailAtom, chatTextAtom }
