import { ProgramCard } from "../ui/cards/program";

export default function Settings() {
	return(
		<>
			<h1 className="page_title">Programs Page</h1>
			<div className="grid grid-cols-3 gap-2 mb-2">
        <ProgramCard />
      </div>
		</>
	)
}