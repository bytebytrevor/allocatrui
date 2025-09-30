type Props = {
    id: number;
    title: string;
}

function Task({id, title}: Props) {
    return(
        <article>
            <h4>{id} {title}</h4>
        </article>
    );
}

export default Task;