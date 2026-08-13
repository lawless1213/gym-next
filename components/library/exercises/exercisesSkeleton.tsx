import SkeletonBone from "@/components/ui/Skeleton/SkeletonBone";

export const ExercisesSkeleton = (
	<div className="space-y-6 mt-6">
		{Array.from({ length: 3 }).map((_, i) => (
			<div
				key={i}
				className="space-y-2">
				<SkeletonBone
					br={12}
					height={20}
				/>
				<SkeletonBone
					br={12}
					height={72}
				/>
			</div>
		))}
	</div>
);