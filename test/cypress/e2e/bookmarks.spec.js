import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import urls from '../../constants/urls';

const ss = {
  recipientInput: '.recipient input',
  amountInput: '.amount input',
  bookmarkInput: '#bookmark-input',
  bookmarkList: '.bookmarkList',
  nextButton: '.send-next-button',
  sendButton: '.send-button',
  transactionRow: '.transactions-row',
  transactionAddress: '.transaction-address span',
};

describe('Bookmarks', () => {
  it('Bookmarks are not present if there is no followers', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.wallet);
    cy.get(ss.recipientInput).click();
    cy.get(ss.bookmarkInput).should('not.exist');
    cy.get(ss.bookmarkList).should('not.exist');
  });

  it('Choose follower from bookmarks and send tx', () => {
    window.localStorage.setItem('followedAccounts', `[
      {"title":"Alice","address":"${accounts.delegate.address}","balance":101}
    ]`);
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.wallet);
    cy.get(ss.recipientInput).click();
    cy.get(ss.bookmarkInput);
    cy.get(ss.bookmarkList).eq(0).contains('Alice');
    cy.get(ss.bookmarkList).eq(0).contains(accounts.delegate.address);
    cy.get(ss.bookmarkList).eq(0).click();
    cy.get(ss.recipientInput).should('have.value', accounts.delegate.address);
    cy.get(ss.amountInput).click().type(1);
    cy.get(ss.nextButton).click();
    cy.get(ss.sendButton).click();
    cy.get(ss.transactionRow).eq(0).find(ss.transactionAddress).should('have.text', accounts.delegate.address);
  });

  it('Search through bookmarks by typing', () => {
    window.localStorage.setItem('followedAccounts', `[
      {"title":"Alice","address":"${accounts.delegate.address}","balance":101},
      {"title":"Bob","address":"${accounts.genesis.address}","balance":101}
    ]`);
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.wallet);
    cy.get(ss.recipientInput).click().type('Bob');
    cy.get(ss.bookmarkList).eq(0).contains('Bob');
    cy.get(ss.recipientInput).clear();
    cy.get(ss.recipientInput).click().type('Merkel');
    cy.get(ss.bookmarkList).should('not.exist');
    cy.get(ss.recipientInput).clear();
    cy.get(ss.recipientInput).click().type(accounts.delegate.address);
    cy.get(ss.bookmarkList).eq(0).contains(accounts.delegate.address);
    cy.get(ss.bookmarkList).eq(0).click();
    cy.get(ss.recipientInput).should('have.value', accounts.delegate.address);
  });
});
