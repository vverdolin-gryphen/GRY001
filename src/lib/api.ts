import { supabase } from './supabase';
import { Building, Todo, Update, Priority, Status } from '../types';

export async function fetchBuildings(): Promise<Building[]> {
    const { data, error } = await supabase
        .from('TRG001_Building_List')
        .select('*');

    if (error) {
        console.error('Error fetching buildings:', error);
        throw error;
    }

    return data.map((b: any) => ({
        id: b.id.toString(),
        buildingNum: b.building_number || '',
        name: b.building_name || '',
        address: b.building_address || '',
        relatedUsers: [b.user_id] // Simplified for now
    }));
}

export async function fetchTodos(): Promise<Todo[]> {
    // Fetch tasks and updates
    const { data: tasks, error: tasksError } = await supabase
        .from('TRG001_Tasks')
        .select(`
      *,
      TRG001_Updates (
        id,
        content,
        created_at
      )
    `);

    if (tasksError) {
        console.error('Error fetching tasks:', tasksError);
        throw tasksError;
    }

    return tasks.map((t: any) => ({
        id: t.id.toString(),
        title: t.title,
        status: (t.status || 'Not Started') as Status,
        priority: (t.priority ? t.priority.charAt(0).toUpperCase() + t.priority.slice(1).toLowerCase() : 'Low') as Priority,
        buildingId: t.building_id?.toString() || '',
        userId: t.user_id,
        description: t.description || '',
        openedOn: t.created_at, // Use created_at as openedOn
        inProgressOn: t.status === 'In Progress' ? t.created_at : undefined, // Approximation if not stored
        completedOn: t.completed_at,
        updates: (t.TRG001_Updates || []).map((u: any) => ({
            timestamp: u.created_at,
            description: u.content
        })).sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    }));
}

export async function createUpdate(todoId: string, content: string) {
    const { data, error } = await supabase
        .from('TRG001_Updates')
        .insert({
            task_id: parseInt(todoId),
            content
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating update:', error);
        throw error;
    }

    return {
        timestamp: data.created_at,
        description: data.content
    } as Update;
}

export async function updateTodoStatus(todoId: string, status: Status) {
    // If completed, set completed_at
    const updates: any = { status };
    if (status === 'Completed') {
        updates.completed_at = new Date().toISOString();
        updates.is_completed = true;
    } else {
        updates.completed_at = null;
        updates.is_completed = false;
    }

    const { error } = await supabase
        .from('TRG001_Tasks')
        .update(updates)
        .eq('id', parseInt(todoId));

    if (error) throw error;
}

export async function updateTodoDetails(todo: Todo) {
    const { error } = await supabase
        .from('TRG001_Tasks')
        .update({
            title: todo.title,
            description: todo.description,
            priority: todo.priority.toLowerCase(),
            building_id: parseInt(todo.buildingId),
            status: todo.status
        })
        .eq('id', parseInt(todo.id));

    if (error) throw error;
}
