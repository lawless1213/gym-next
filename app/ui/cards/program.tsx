"use client";

import { Button } from "../buttons/button";
import { IconGripVertical, IconPlus, IconEdit, IconTrash, IconCheck } from "@tabler/icons-react";

export function ProgramCard() {
  const deleteButtonHandler: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    console.log("Program delete");
  };

  const editButtonHandler: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    console.log("Program edit");
  };

  return (
    <div className="flex flex-col rounded-md bg-panel border border-[#bfff00] p-4 gap-3">
      <div className="flex flex-col gap-2">
        <div className="flex gap-1 items-center justify-between">
          <span className="px-4 py-1 uppercase font-bold bg-[#bfff00]/25 text-[#bfff00] rounded-4xl text-sm">First - 900 kcal</span>
          <div className="flex gap-1">
            <Button
              button={{
                onClick: editButtonHandler,
                icon: <IconEdit size={16} />,
                border: true,
              }}
            />
            <Button
              button={{
                onClick: deleteButtonHandler,
                icon: <IconTrash size={16} />,
                border: true,
              }}
            />
          </div>
        </div>
      </div>
			<div className="div">
				<div className="bg-background p-3 flex gap-2">
						<div className="w-12 h-12"></div>
						<div className="flex flex-col gap-1 justify-center">
							<p className="font-bold">Front Plank</p>
							<div className="flex items-center gap-2 text-xs">
								<p className="">3</p>
								<p className="text-gray-400">x</p>
								<p>60 reps</p>
							</div>
						</div>
				</div>
			</div>
      <div className="flex flex-col gap-1">
        <p className="text-sm text-gray-400">300 exercise.calories.per.set</p>
      </div>
    </div>
  );
}
