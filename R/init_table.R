con <- DBI::dbConnect(
              RMariaDB::MariaDB(),
              host = '127.0.0.1',
              port = '3306',
              user = 'root',
              password = 'example',
              dbname = 'jsPsych'
            )

trial_1 <- list(
  type = 'html',
  prompt = 'Please answer the following questions'
)

trial_2 <- list(
  type = 'multi-choice',
  prompt = 'Which of the following do you like the most?',
  name = 'VegetablesLike',
  options = c('Tomato', 'Cucumber', 'Eggplant', 'Corn', 'Peas'),
  required = TRUE
)

trial_3 <- list(
  type = 'multi-select',
  prompt = 'Which of the following do you like?',
  name = 'FruitLike',
  options = c('Apple', 'Banana', 'Orange', 'Grape', 'Strawberry'),
  required = TRUE
)

json_list <- purrr::map(list(trial_1, trial_2, trial_3), jsonlite::toJSON, auto_unbox = TRUE)

item_strings <- tibble::tibble(
                          item = 1:3,
                          json = purrr::map_chr(json_list, as.character)
                        )

DBI::dbWriteTable(con, name = 'item_strings', item_strings)

DBI::dbDisconnect(con)
