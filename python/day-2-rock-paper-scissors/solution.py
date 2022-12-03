# All moves are resolved to:
# Paper = P
# Scissors = S
# Rock = R

# Moves are then resolved to outcomes and scores

# Both parts
move_score_map = {'R': 1, 'P': 2, 'S': 3}

# Part 1
opponent_move_map = {'A': 'R', 'B': 'P', 'C': 'S'}
suggested_move_map = {'X': 'R', 'Y': 'P', 'Z': 'S'}
outcome_score_map = {'R': {'R': 3, 'P': 0, 'S': 6}, 'P': {
    'R': 6, 'P': 3, 'S': 0}, 'S': {'R': 0, 'P': 6, 'S': 3}}

# Part 2
result_map = {'X': 0, 'Y': 3, 'Z': 6}
outcome_map = {'X': {'R': 'S', 'P': 'R', 'S': 'P'}, 'Y': {'R': 'R', 'P': 'P', 'S': 'S'}, 'Z': {'R': 'P', 'P': 'S', 'S': 'R'}}


def get_outcome_score(suggested_move, opponent_move):
    return outcome_score_map[suggested_move][opponent_move]


def suggested_move_round_score(opponent_move, suggested_move):
    suggested_resolved_move = suggested_move_map[suggested_move]
    opponent_resolved_move = opponent_move_map[opponent_move]
    return move_score_map[suggested_resolved_move] + outcome_score_map[suggested_resolved_move][opponent_resolved_move]

def suggested_outcome_round_score(opponent_move, desired_outcome):
    opponent_resolved_move = opponent_move_map[opponent_move]
    suggested_resolved_move = outcome_map[desired_outcome][opponent_resolved_move]
    return move_score_map[suggested_resolved_move] + result_map[desired_outcome]


def strategy_guide_total_score_part1(filename):
    # Using readlines()
    file = open(filename, 'r')
    lines = file.readlines()

    # Variable initilisation
    total_score = 0

    # Strips the newline character
    for line in lines:
        line_content = line.strip()
        if (line_content == '' or line_content is None):
            continue
        else:
            opponent_move = line_content[0]
            suggested_move = line_content[2]
            total_score += suggested_move_round_score(opponent_move, suggested_move)
    return total_score

def strategy_guide_total_score_part2(filename):
    # Using readlines()
    file = open(filename, 'r')
    lines = file.readlines()

    # Variable initilisation
    total_score = 0

    # Strips the newline character
    for line in lines:
        line_content = line.strip()
        if (line_content == '' or line_content is None):
            continue
        else:
            opponent_move = line_content[0]
            suggested_move = line_content[2]
            total_score += suggested_outcome_round_score(opponent_move, suggested_move)
    return total_score
