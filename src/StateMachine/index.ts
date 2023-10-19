import { ContactID } from 'kozz-types';
import { MessageObj } from '../Message';

type State<States extends string> =
    {
        onMessage: (
            requester: MessageObj,
            stateMachineInstance: StateMachineInstance<States>
        ) => any;
        onStateEnable?:
        (
            requester: MessageObj,
            stateMachineInstance: StateMachineInstance<States>
        ) => any;

    }

type StateMachineDescriptor<States extends string> = {
    initialState: States;
    states: Record<States, State<States>>;
};

type StateMachineInstance<States extends string> = StateMachineDescriptor<States> & {
    currentState: States;
    setState: (newState: States) => void;
    reset: () => void;
};

type NoInfer<T> = [T][T extends any ? 0 : never];

export const createNewStateMachineInstance = <States extends string>(
    stateMachineDescriptor: {
        initialState: NoInfer<States>;
        states: Record<States, State<States>>;
    }
): StateMachineInstance<States> => {

    const stateMachine = {
        ...stateMachineDescriptor,
        currentState: stateMachineDescriptor.initialState as States,
        setState: (newState: States) => {
            stateMachine.currentState = newState;
        },
        reset: () => stateMachine.setState(stateMachine.initialState),
    };

    return stateMachine as StateMachineInstance<States>
};

export const createStateMachine = <States extends string>(
    stateMachineDescriptor: {
        initialState: NoInfer<States>;
        states: Record<States, State<States>>;
    }
) => {
    const userStateMap = new Map<ContactID, StateMachineInstance<States>>();

    /**
     * One single instance per contact.
     * @param contactId
     * @returns
     */
    const getStateMachine = (contactId: ContactID) => {
        if (!userStateMap.get(contactId)) {
            userStateMap.set(
                contactId,
                // @ts-ignore
                createNewStateMachineInstance<Desc>(stateMachineDescriptor)
            );
        }

        return userStateMap.get(contactId)!;
    };

    return (requester: MessageObj) => {
        const stateMachine = getStateMachine(requester.message.contact.id);
        const oldState = stateMachine.currentState;

        stateMachine.states[stateMachine.currentState].onMessage(requester, stateMachine);

        const newState = stateMachine.currentState;

        if (newState !== oldState) {
            stateMachine.states[stateMachine.currentState].onStateEnable?.(requester, stateMachine);
        }
    };
};

export type StateMachineController = ReturnType<typeof createStateMachine>;
