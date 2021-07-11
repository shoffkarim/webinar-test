import { memo, useCallback, useState } from 'react'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import DeleteIcon from '@material-ui/icons/Delete'
import { makeStyles } from '@material-ui/core/styles'
import classnames from 'classnames'
import { motion } from 'framer-motion'
import { tags, TodoItem, useTodoItems } from './TodoItemsContext'
import { TodoTagsFilter } from './TodoTagsFilter'
import { Button, TextField } from '@material-ui/core'
import { Controller, useForm } from 'react-hook-form'

const spring = {
    type: 'spring',
    damping: 25,
    stiffness: 120,
    duration: 0.25,
}

const useTodoItemListStyles = makeStyles({
    root: {
        listStyle: 'none',
        padding: 0,
    },
})

export const TodoItemsList = function () {
    const { dispatch } = useTodoItems()
    const { todoItems, filter } = useTodoItems()
    const classes = useTodoItemListStyles()

    const TodoHandleFilter = useCallback(
        (tag: string) => dispatch({ type: 'filterTag', data: { tag } }),
        [dispatch]
    )

    const sortedItems = todoItems.slice().sort((a, b) => {
        if (a.done && !b.done) {
            return 1
        }

        if (!a.done && b.done) {
            return -1
        }

        return 0
    })

    return (
        <>
            <TodoTagsFilter handleFilter={(value) => TodoHandleFilter(value)} />
            <ul className={classes.root}>
                {sortedItems.map((item) =>
                    filter === item.tag || filter === '0' ? (
                        <motion.li
                            key={item.id}
                            transition={spring}
                            layout={true}
                        >
                            <TodoItemCard item={item} />
                        </motion.li>
                    ) : null
                )}
            </ul>
        </>
    )
}

const useTodoItemCardStyles = makeStyles({
    root: {
        marginTop: 24,
        marginBottom: 24,
    },
    doneRoot: {
        textDecoration: 'line-through',
        color: '#888888',
    },
})

export const TodoItemCard = memo(function ({ item }: { item: TodoItem }) {
    const classes = useTodoItemCardStyles()
    const { dispatch } = useTodoItems()
    const [edit, setEdit] = useState(false)
    const [details, setDetails] = useState(item.details)
    const [title, setTitle] = useState(item.title)

    const handleDelete = useCallback(
        () => dispatch({ type: 'delete', data: { id: item.id } }),
        [item.id, dispatch]
    )

    const { control, handleSubmit } = useForm()

    const handleToggleDone = useCallback(
        () =>
            dispatch({
                type: 'toggleDone',
                data: { id: item.id },
            }),
        [item.id, dispatch]
    )
    const handleEdit = () => {
        setEdit(!edit)
    }
    return (
        <Card
            className={classnames(classes.root, {
                [classes.doneRoot]: item.done,
            })}
        >
            <form
                onSubmit={handleSubmit((formData) => {
                    dispatch({
                        type: 'add',
                        data: {
                            todoItem: Object.assign(formData, {
                                title: title,
                                details: details,
                                tag: item.tag,
                            }),
                        },
                    })
                    handleDelete()
                })}
            >
                <CardHeader
                    action={
                        <>
                            {!edit && (
                                <Button onClick={handleEdit}>edit</Button>
                            )}
                            <IconButton
                                aria-label="delete"
                                onClick={handleDelete}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </>
                    }
                    title={
                        !edit ? (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={item.done}
                                        onChange={handleToggleDone}
                                        name={`checked-${item.id}`}
                                        color="primary"
                                    />
                                }
                                label={item.title}
                            />
                        ) : (
                            <>
                                <Controller
                                    name="title"
                                    control={control}
                                    defaultValue={details ? details : null}
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <TextField
                                            fullWidth={true}
                                            multiline={true}
                                            className={classes.root}
                                            value={title}
                                            onChange={(e) =>
                                                setTitle(e.target.value)
                                            }
                                        />
                                    )}
                                />
                            </>
                        )
                    }
                />
                {item.details ? (
                    <CardContent>
                        {!edit ? (
                            <Typography variant="body2" component="p">
                                {details}
                            </Typography>
                        ) : (
                            <>
                                <Controller
                                    name="details"
                                    control={control}
                                    defaultValue={details ? details : null}
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <TextField
                                            fullWidth={true}
                                            multiline={true}
                                            className={classes.root}
                                            value={details}
                                            onChange={(e) =>
                                                setDetails(e.target.value)
                                            }
                                        />
                                    )}
                                />
                            </>
                        )}
                    </CardContent>
                ) : null}
                {item.tag ? (
                    <CardContent>
                        <Typography variant="body2" component="p">
                            {'Tags: '}
                            {tags.map((tagItem) =>
                                tagItem.id === item.tag ? (
                                    <span key={tagItem.id}>{tagItem.name}</span>
                                ) : null
                            )}
                        </Typography>
                    </CardContent>
                ) : null}
                {edit && (
                    <CardContent>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                        >
                            submit
                        </Button>
                    </CardContent>
                )}
            </form>
        </Card>
    )
})
