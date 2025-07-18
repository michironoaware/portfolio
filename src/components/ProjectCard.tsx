﻿import React, { useEffect, useId, useState } from "react";
import TechnologyTagList from "./TechnologyTagList.tsx";
import ProjectDescriptor from "./ProjectDescriptor.ts";
import GithubProjectDescriptor from "./GithubProjectDescriptor.ts";
import { octokit } from "../shared/octokit.ts";
import "../styles/ProjectCard.css";

export default function ProjectCard(props: IProjectCardProperties)
{
	const [ name, setName ] = useState<string>();
	const [ description, setDescription ] = useState<string>();
	const [ address, setAddress ] = useState<string | undefined>();

	const elementId = useId();

	useEffect(() =>
	{
		if (props.project instanceof GithubProjectDescriptor)
		{
			const repositoryAddress = `https://github.com/${props.project.ownerName}/${props.project.repositoryName}`;
			setAddress(repositoryAddress);
			document.getElementById(elementId)!.addEventListener("click", () => window.open(repositoryAddress, '_blank')!.focus());

			octokit.rest.repos.get({
				owner: props.project.ownerName,
				repo: props.project.repositoryName
			}).then(response =>
			{
				if (response.status < 200 || response.status > 299)
				{
					setName("?");
					setDescription("It appears to be a problem while communicating with GitHub.");
					return;
				}

				setName(response.data.name);
				setDescription(response.data.description ?? "...");
			});
		}
	}, []);

	return <div className="ProjectCard Button">
		<div id={elementId}>
			{address
				? <a className="ProjectCard_name" href={address} target="_blank" rel="noopener noreferrer">{name}</a>
				:<h3 className="ProjectCard_name">{name}</h3>}
			<p className="ProjectCard_description">{description}</p>
		</div>
		<TechnologyTagList technologies={props.project.technologies}></TechnologyTagList>
	</div>
}

export interface IProjectCardProperties
{
	project: ProjectDescriptor;
}
